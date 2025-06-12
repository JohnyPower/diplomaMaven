import requests
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g
import asyncio
import aiohttp
from flask_babel import Babel, _

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_super_secret_key'
app.config['API_URL'] = 'http://127.0.0.1:4500/platform'
app.config['EOD_API_KEY'] = '676f18119fc886.11186595'
app.config['EXCHANGE_RATE_API_KEY'] = '0e603f2a3f037b51b7075e05'
app.config['ALPHA_VANTAGE_API_KEY'] = '8GKJNZIW9BWWZBZK'  # Замініть на свій ключ Alpha Vantage
app.config['BABEL_TRANSLATION_DIRECTORIES'] = 'translations'  # Directory for .po files
app.config['LANGUAGES'] = ['en', 'pl']  # Supported languages


babel = Babel()

def get_locale():
    if 'language' in session:
        return session['language']
    # If no language is set, default to English
    session['language'] = 'en'
    return 'en'  # Default language


babel.init_app(app, locale_selector=get_locale)



@app.before_request
def before_request():
    g.locale = get_locale()

# Декоратор для захисту сторінок, які потребують аутентифікації
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = session.get('token')
        if not token:
            return redirect(url_for('login'))
        return f(*args, **kwargs)

    return decorated_function


@app.errorhandler(404)
def page_not_found(e):
    if 'token' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        api_url = f"{app.config['API_URL']}/auth/login"
        data = {"email": email, "password": password}
        try:
            response = requests.post(api_url, json=data)
            response.raise_for_status()
            api_data = response.json()
            session['token'] = api_data.get('accessToken')
            session['refresh_token'] = api_data.get('refreshToken')
            return redirect(url_for('dashboard'))
        except requests.exceptions.RequestException as e:
            error = f"{_('Login Error')}: {e}"
            if response.status_code == 401:
                error = _("Wrong email or password")
            print(f"Login error: {e}")
        except Exception as e:
            error = f"{_('Login Error')}: {e}"
            print(f"Login error: {e}")

    return render_template('login.html', error=error, languages=app.config['LANGUAGES'])



@app.route('/set_language/<language>')
def set_language(language):
    if language not in app.config['LANGUAGES']:
        language = 'en'  # Default to 'en' if the selected language is not supported
    session['language'] = language
    return redirect(request.referrer or url_for('login'))


# ... rest of your routes
@app.route('/dashboard')
@login_required
def dashboard():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        response = requests.get(f"{app.config['API_URL']}/user", headers=headers)
        response2 = requests.get(
            f"https://eodhd.com/api/news?offset=0&limit=10&api_token={app.config['EOD_API_KEY']}&fmt=json")
        response.raise_for_status()
        response2.raise_for_status()
        news_data = response2.json()
        profile_data = response.json()
        if 'user' in profile_data and 'balance' in profile_data['user']:
            profile_data['user']['formatted_balance'] = f"{float(profile_data['user']['balance']):,.2f}"
        for item in news_data:
            date_object = datetime.fromisoformat(item['date'].replace('Z', '+00:00'))
            item['formatted_date'] = date_object.strftime('%d %b %Y %H:%M')
        return render_template('my-dashboard.html', profile=profile_data, news=news_data, languages=app.config['LANGUAGES'], app=app)
    except requests.exceptions.RequestException as e:
        print(f"Dashboard error: {e}")
        if response.status_code == 401:
            return redirect(url_for('refresh_token'))
        else:
            return f"Dashboard Error: {e}", 500

@app.route('/my-asset')
@login_required
def my_asset():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        response = requests.get(f"{app.config['API_URL']}/user", headers=headers)
        response.raise_for_status()
        profile_data = response.json()
        if 'user' in profile_data and 'balance' in profile_data['user']:
            profile_data['user']['formatted_balance'] = f"{float(profile_data['user']['balance']):,.2f}"
        return render_template('my-asset.html', profile=profile_data, languages=app.config['LANGUAGES'], app=app)
    except requests.exceptions.RequestException as e:
        print(f"Dashboard error: {e}")
        if response.status_code == 401:
            return redirect(url_for('refresh_token'))
        else:
            return f"Dashboard Error: {e}", 500


@app.route('/order-history')
@login_required
def order_history():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        response = requests.get(f"{app.config['API_URL']}/user", headers=headers)
        response.raise_for_status()
        profile_data = response.json()
        if 'user' in profile_data and 'balance' in profile_data['user']:
            profile_data['user']['formatted_balance'] = f"{float(profile_data['user']['balance']):,.2f}"

        positions_response = requests.get(f"{app.config['API_URL']}/position/all", headers=headers)
        positions_response.raise_for_status()
        positions_data = positions_response.json().get('positions', [])

        for pos in positions_data:
            if pos.get('createdAt'):
                date_object = datetime.fromisoformat(pos['createdAt'].replace('Z', '+00:00'))
                pos['formatted_date'] = date_object.strftime('%d %b %Y %H:%M')

        open_orders = [pos for pos in positions_data if pos.get('isActive')]
        order_history = [pos for pos in positions_data if not pos.get('isActive')]

        return render_template('order-history.html', profile=profile_data, open_orders=open_orders,
                               order_history=order_history, languages=app.config['LANGUAGES'], app=app)
    except requests.exceptions.RequestException as e:
        print(f"Dashboard error: {e}")
        if response.status_code == 401:
            return redirect(url_for('refresh_token'))
        else:
            return f"Dashboard Error: {e}", 500


@app.route('/settings')
@login_required
def settings():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        response = requests.get(f"{app.config['API_URL']}/user", headers=headers)
        response.raise_for_status()
        profile_data = response.json()
        if 'user' in profile_data and 'balance' in profile_data['user']:
            profile_data['user']['formatted_balance'] = f"{float(profile_data['user']['balance']):,.2f}"
        return render_template('settings.html', profile=profile_data, languages=app.config['LANGUAGES'], app=app)
    except requests.exceptions.RequestException as e:
        print(f"Dashboard error: {e}")
        if response.status_code == 401:
            return redirect(url_for('refresh_token'))
        else:
            return f"Dashboard Error: {e}", 500


@app.route('/handle_payment', methods=['POST'])
@login_required
def handle_payment():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    if 'deposit' in request.form or 'withdraw' in request.form:
        amount = request.form.get('amount')
        method = request.form.get('method')
        pay_method = 'payin' if 'deposit' in request.form else 'payout'
        wallet_address = request.form.get('wallet_address')
        card_number = request.form.get('card_number')
        api_url = f"{app.config['API_URL']}/payment"
        data = {
            "amount": float(amount),
            "method": method,
            "pay_method": pay_method
        }
        if pay_method == 'payout':
            if wallet_address:
                data["wallet_address"] = wallet_address
            if card_number:
                data["card_number"] = card_number
        print(data)
        try:
            response = requests.post(api_url, headers=headers, json=data)
            response.raise_for_status()
            print(response.json())
            return redirect(url_for('dashboard'))
        except requests.exceptions.RequestException as e:
            print(f"Payment error: {e}")
            return f"Payment Error: {e}", 500
        except Exception as e:
            print(f"Payment error: {e}")
            return f"Payment Error: {e}", 500
    return redirect(url_for('dashboard'))


@app.route('/exchange', methods=['GET', 'POST'])
@login_required
def exchange():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        response = requests.get(f"{app.config['API_URL']}/user", headers=headers)
        response.raise_for_status()
        profile_data = response.json()
        if 'user' in profile_data and 'balance' in profile_data['user']:
            profile_data['user']['formatted_balance'] = f"{float(profile_data['user']['balance']):,.2f}"

        pairs, prices = asyncio.run(
            fetch_data_async(session.get('token'), app.config['API_URL'], app.config['EXCHANGE_RATE_API_KEY'],
                             app.config['ALPHA_VANTAGE_API_KEY']))

        positions_response = requests.get(f"{app.config['API_URL']}/position/all", headers=headers)
        positions_response.raise_for_status()
        positions_data = positions_response.json().get('positions', [])

        if request.method == 'POST':
            if 'close_position' in request.form:
                position_id = request.form.get('close_position')
                api_url = f"{app.config['API_URL']}/position"
                try:
                    response = requests.put(api_url, headers=headers,
                                            json={"positionId": position_id, "isActive": False})
                    response.raise_for_status()
                    return redirect(url_for('exchange'))
                except requests.exceptions.RequestException as e:
                    print(f"Close position error: {e}")
                    return f"Close position Error: {e}", 500
                except Exception as e:
                    print(f"Close position error: {e}")
                    return f"Close position Error: {e}", 500
            else:
                pair_id = request.form.get('pair_id')
                amount = request.form.get('amount')
                take_profit = request.form.get('take_profit')
                stop_loss = request.form.get('stop_loss')
                order_type = request.form.get('order_type')

                api_url = f"{app.config['API_URL']}/position"

                data = {
                    "pairId": pair_id,
                    "amount": float(amount),
                    "type": order_type
                }

                if take_profit:
                    data["takeProfit"] = take_profit
                if stop_loss:
                    data["stopLoss"] = stop_loss

                print(data)

                try:
                    response = requests.post(api_url, headers=headers, json=data)
                    response.raise_for_status()
                    return redirect(url_for('exchange'))
                except requests.exceptions.RequestException as e:
                    print(f"Order error: {e}")
                    return f"Order Error: {e}", 500
                except Exception as e:
                    print(f"Order error: {e}")
                    return f"Order Error: {e}", 500

        default_pair = next((pair for pair in pairs if pair['pair'] == 'BTC/USDT' and pair['type'] == 'crypto'), None)

        for pos in positions_data:
            if pos.get('createdAt'):
                date_object = datetime.fromisoformat(pos['createdAt'].replace('Z', '+00:00'))
                pos['formatted_date'] = date_object.strftime('%d %b %Y %H:%M')

        open_orders = [pos for pos in positions_data if pos.get('isActive')]
        order_history = [pos for pos in positions_data if not pos.get('isActive')]

        return render_template('exchange.html', pairs=pairs, prices=prices, profile=profile_data,
                               open_orders=open_orders, order_history=order_history, default_pair=default_pair, languages=app.config['LANGUAGES'], app=app)
    except requests.exceptions.RequestException as e:
        print(f"Dashboard error: {e}")
        if response.status_code == 401:
            return redirect(url_for('refresh_token'))
        else:
            return f"Dashboard Error: {e}", 500


async def fetch_data_async(token, api_url, exchange_api_key, alpha_vantage_api_key):
    pairs = await fetch_pairs_async(token, api_url)
    prices = await fetch_prices_async(pairs, exchange_api_key, alpha_vantage_api_key)
    return pairs, prices


async def fetch_pairs_async(token, api_url):
    try:
        all_pairs = []
        current_page = 1
        total_pages = 1
        async with aiohttp.ClientSession() as session:
            while current_page <= total_pages:
                async with session.get(f"{api_url}/pair/all?page={current_page}",
                                       headers={"Authorization": f"Bearer {token}"}) as response:
                    response.raise_for_status()
                    data = await response.json()

                    if data and data.get('pairs'):
                        pairs = data['pairs']
                        for pair in pairs:
                            if pair['type'] in ('crypto', 'forex', 'stock'):
                                pair['symbol'] = f"BINANCE:{pair['pair'].replace('/', '')}" if pair[
                                                                                                   'type'] == "crypto" else \
                                    pair['pair'].replace('/', '')
                                all_pairs.append(pair)
                        total_pages = data.get('totalPages')
                        current_page += 1
                    else:
                        break
        return all_pairs
    except aiohttp.ClientError as e:
        print(f"API error: {e}")
        return []
    except Exception as e:
        print(f"Other error: {e}")
        return []


async def fetch_prices_async(pairs, exchange_api_key, alpha_vantage_api_key):
    prices = {}
    crypto_pairs = [pair for pair in pairs if pair['type'] == 'crypto']
    forex_pairs = [pair for pair in pairs if pair['type'] == 'forex']
    stock_pairs = [pair for pair in pairs if pair['type'] == 'stock']

    async with aiohttp.ClientSession() as session:
        async def fetch_crypto_price(pair):
            binance_symbol = pair['symbol'].replace('BINANCE:', '')
            binance_url = f"https://api.binance.com/api/v3/ticker/price?symbol={binance_symbol}"

            try:
                async with session.get(binance_url) as binance_response:
                    binance_response.raise_for_status()
                    binance_data = await binance_response.json()
                    prices[pair['symbol']] = float(binance_data['price'])
            except aiohttp.ClientError as e:
                print(f"Error fetching Binance price for {pair['symbol']}: {e}")

        async def fetch_forex_price(pair):
            if pair['type'] == 'forex':
                forex_symbol = pair['pair'].replace('/', '')
                alpha_vantage_url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={forex_symbol[:3]}&to_currency={forex_symbol[3:]}&apikey={alpha_vantage_api_key}"
                try:
                    async with session.get(alpha_vantage_url) as alpha_vantage_response:
                        alpha_vantage_response.raise_for_status()
                        alpha_vantage_data = await alpha_vantage_response.json()
                        if "Realtime Currency Exchange Rate" in alpha_vantage_data and "5. Exchange Rate" in \
                                alpha_vantage_data["Realtime Currency Exchange Rate"]:
                            prices[pair['symbol']] = float(
                                alpha_vantage_data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
                        else:
                            print(f"Error fetching Alpha Vantage price for {pair['symbol']}: {alpha_vantage_data}")
                except aiohttp.ClientError as e:
                    print(f"Error fetching Alpha Vantage price for {pair['symbol']}: {e}")

        async def fetch_stock_price(pair):
            alpha_vantage_url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={pair['pair']}&apikey={alpha_vantage_api_key}"
            try:
                async with session.get(alpha_vantage_url) as alpha_vantage_response:
                    alpha_vantage_response.raise_for_status()
                    alpha_vantage_data = await alpha_vantage_response.json()
                    if "Global Quote" in alpha_vantage_data and "05. price" in alpha_vantage_data["Global Quote"]:
                        prices[pair['symbol']] = float(alpha_vantage_data["Global Quote"]["05. price"])
                    else:
                        print(f"Error fetching Alpha Vantage price for {pair['symbol']}: {alpha_vantage_data}")
            except aiohttp.ClientError as e:
                print(f"Error fetching Alpha Vantage price for {pair['symbol']}: {e}")

        await asyncio.gather(
            *(fetch_crypto_price(pair) for pair in crypto_pairs),
            *(fetch_forex_price(pair) for pair in forex_pairs),
            *(fetch_stock_price(pair) for pair in stock_pairs),
        )
    return prices


@app.route('/refresh_token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect(url_for('login'))
    api_url = f"{app.config['API_URL']}/auth/refresh"
    data = {"refreshToken": session.get('refresh_token')}
    try:
        response = requests.post(api_url, json=data)
        response.raise_for_status()
        api_data = response.json()
        session['token'] = api_data.get('accessToken')
        session['refresh_token'] = api_data.get('refreshToken')
        return redirect(url_for('dashboard'))
    except requests.exceptions.RequestException as e:
        print(f"Refresh error: {e}")
        session.pop('token', None)
        session.pop('refresh_token', None)
        return redirect(url_for('login'))
    except Exception as e:
        print(f"Refresh error: {e}")
        session.pop('token', None)
        session.pop('refresh_token', None)
        return redirect(url_for('login'))


@app.route('/api/open-orders', methods=['GET'])
@login_required
def get_open_orders():
    headers = {'Authorization': f'Bearer {session.get("token")}'}
    try:
        positions_response = requests.get(f"{app.config['API_URL']}/position/all", headers=headers)
        positions_response.raise_for_status()
        positions_data = positions_response.json().get('positions', [])

        for pos in positions_data:
            if pos.get('createdAt'):
                date_object = datetime.fromisoformat(pos['createdAt'].replace('Z', '+00:00'))
                pos['formatted_date'] = date_object.strftime('%d %b %Y %H:%M')

        open_orders = [
            {
                "formatted_date": pos.get('formatted_date'),
                "pair": pos.get('pair', {}).get('pair'),
                "type": pos.get('type'),
                "enterPrice": pos.get('enterPrice'),
                "takeProfit": pos.get('takeProfit'),
                "stopLoss": pos.get('stopLoss'),
                "amount": pos.get('amount'),
                "currentPrice": pos.get('currentPrice'),
                "profit": pos.get('profit'),
                "id": pos.get('id')
            }
            for pos in positions_data if pos.get('isActive')
        ]
        return jsonify(open_orders)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/logout')
def logout():
    session.pop('token', None)
    session.pop('refresh_token', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    import json

    app.run(debug=True, port=5001)