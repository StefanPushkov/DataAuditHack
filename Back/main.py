from flask import Flask, request
from joblib import dump, load
#import RealtyTime.API_methods.settings_local as SETTINGS
app = Flask(__name__)







@app.route('/')
def main():
    return 'Hi :)'

@app.route('/INvestingAnketa')
def map():
    building_type_str = request.args.get('building_type_str')
    longitude = request.args.get('lng')
    latitude = request.args.get('lat')
    full_sq = request.args.get('full_sq')
    kitchen_sq = request.args.get('kitchen_sq')
    life_sq = request.args.get('life_sq')
    is_apartment = request.args.get('is_apartment')
    renovation = request.args.get('renovation')
    has_elevator = request.args.get('has_elevator')
    floor_first = request.args.get('floor_first')
    floor_last = request.args.get('floor_last')
    time_to_metro = request.args.get('time_to_metro')


    list_of_requested_params_price = [building_type_str, renovation, has_elevator, longitude, latitude, full_sq, kitchen_sq,
                                life_sq, is_apartment, time_to_metro, floor_last, floor_first]



    # SALE TERM PREDICTION
    list_of_requested_params_term = [building_type_str, renovation, has_elevator, longitude, latitude, full_sq, kitchen_sq,
                                     life_sq, is_apartment, time_to_metro,
                                     floor_last, floor_first]

    return

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='localhost')