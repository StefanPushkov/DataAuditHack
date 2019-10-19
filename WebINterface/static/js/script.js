(function($) {

    $(() => {
        const header = $('#header');
        const checkScroll = () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            if (header.is('.scrolled') && (scrolled < 50)) {
                header.removeClass('scrolled');
            } else if (!header.is('.scrolled') && (scrolled > 50)) {
                header.addClass('scrolled');
            }
        };
        window.onscroll = () => {
            checkScroll();
        };
        checkScroll();
    });


    let mapCenter, placemark;
    const formRequest = {};


    const checkMetroDuration = () => {
        window['ymaps'].geocode(mapCenter, { kind: 'metro' }).then((res) => {
            const nearest = res.geoObjects.get(0);
            const multiRouteModel = new window['ymaps'].multiRouter.MultiRouteModel([
                mapCenter,
                nearest.geometry.getCoordinates()
            ], {
                routingMode: 'pedestrian'
            });
            multiRouteModel.events.add("requestsuccess", () => {
                const routes = multiRouteModel.getRoutes();
                formRequest.time_to_metro = Math.round(routes[0].properties.get("duration").value / 60);
                console.log(formRequest);
            });
        });
    };


    const setMarkerPosition = () => {
        placemark.geometry.setCoordinates(mapCenter);
        formRequest.lat = mapCenter[0];
        formRequest.lng = mapCenter[1];
        checkMetroDuration()
    };


    const init = () => {
        mapCenter = [55.76, 37.64];
        const myMap = new window['ymaps'].Map("realty-map", {
            center: mapCenter,
            zoom: 15
        });
        placemark = new window['ymaps'].Placemark(mapCenter, {}, {
            preset: 'islands#redIcon'
        });
        myMap.geoObjects.add(placemark);
        setMarkerPosition();
        myMap.events.add('click', (event) => {
            mapCenter = event.get('coords');
            setMarkerPosition();
        });
    };


    window['ymaps'].ready(init);


    $.fn.validator = function() {
        $(this).each(function() {
            const input = $(this);
            input.on("input keydown keyup mousedown mouseup select contextmenu drop", function(event) {

            });
        });
    };

    const toRequestParams = (requestParams) => {
        const requestClone = {...requestParams};
        const request = {};
        for (const param in requestClone) {
            request[param] = (requestClone[param] === true) ? '1' : requestClone[param] === false ? '0' : encodeURIComponent(requestClone[param].toString());
        }
        return request;
    };

    $(() => {
        const results = $('#results');
        const resultPrice = $('#result_price');
        const resultDuration = $('#result_duration');



        $('[data-validator]').validator();
        const calculateForm = $('#calculate-form').on('submit', (event) => {
            event.preventDefault();
            const fields = $('input, select', calculateForm);
            const values = {};

            fields.each(function() {
                const itemModel = $(this);
                const itemType = itemModel.attr('type');
                switch (itemType) {
                    case 'checkbox':
                        values[itemModel.attr('name')] = itemModel.is(':checked');
                        break;
                    default:
                        values[itemModel.attr('name')] = itemModel.val();
                }
            });

            const convertedFormData = toRequestParams(values);

            for (const k in convertedFormData) {
                formRequest[k] = convertedFormData[k];
            }

            results.hide();

            $.ajax({
                url: '/map',
                data: formRequest
            }).always(() => {
                results.show();
            }).then((res) => {
		        resultPrice.text(res.Price + ' руб.');
		        resultDuration.text(res.Duration + ' дн.');
            });
            return false;
        });
    });




})(jQuery);
