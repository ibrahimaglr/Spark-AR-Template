const Diagnostics = require('Diagnostics');
const Patches = require('Patches');
const Textures = require('Textures');
const Materials = require('Materials');
const Locale = require('Locale');


(async function() {


    const [SundayTexture, MondayTexture, TuesdayTexture, WednesdayTexture, ThursdayTexture, FridayTexture, SaturdayTexture, DynamicWeekdayMaterial] = await Promise.all([
        Textures.findFirst('Sunday'),
        Textures.findFirst('Monday'),
        Textures.findFirst('Tuesday'),
        Textures.findFirst('Wednesday'),
        Textures.findFirst('Thursday'),
        Textures.findFirst('Friday'),
        Textures.findFirst('Saturday'),
        Materials.findFirst('DynamicWeekdayMaterial'),
]);

    Locale.language.monitor({ fireOnInitialValue: true }).subscribe(function (values) {

        const language = values.newValue;
        Diagnostics.log(values.newValue);

        var dayOfWeek = [];


        switch (language) {
            // English
            case 'en':

                //Patches.inputs.setBoolean('ConditionTrue', true);
                dayOfWeek[0] = 'Sunday';
                dayOfWeek[1] = 'Monday';
                dayOfWeek[2] = 'Tuesday';
                dayOfWeek[3] = 'Wednesday';
                dayOfWeek[4] = 'Thursday';
                dayOfWeek[5] = 'Friday';
                dayOfWeek[6] = 'Saturday';
                break;
            // Spanish
            case 'es':
                dayOfWeek[0] = 'domingo';
                dayOfWeek[1] = 'lunes';
                dayOfWeek[2] = 'martes';
                dayOfWeek[3] = 'miércoles';
                dayOfWeek[4] = 'jueves';
                dayOfWeek[5] = 'viernes';
                dayOfWeek[6] = 'sábado';
                break;
            // French
            case 'fr':
                dayOfWeek[0] = 'lundi';
                dayOfWeek[1] = 'mardi';
                dayOfWeek[2] = 'mercredi';
                dayOfWeek[3] = 'jeudi';
                dayOfWeek[4] = 'vendredi';
                dayOfWeek[5] = 'samedi';
                dayOfWeek[6] = 'dimanche';
                break;
            case 'pt':
                dayOfWeek[0] = 'Domingo';
                dayOfWeek[1] = 'Segunda-feira';
                dayOfWeek[2] = 'Terça-feira';
                dayOfWeek[3] = 'Quarta-feira';
                dayOfWeek[4] = 'Quinta-feira';
                dayOfWeek[5] = 'Sexta-feira';
                dayOfWeek[6] = 'Sábado';
                break;
            case 'ru':
                dayOfWeek[0] = 'Воскресенье';
                dayOfWeek[1] = 'Понедельник';
                dayOfWeek[2] = 'Вторник';
                dayOfWeek[3] = 'Среда';
                dayOfWeek[4] = 'Четверг';
                dayOfWeek[5] = 'Пятница';
                dayOfWeek[6] = 'Суббота';
                break;
            // Other
            default:
                Diagnostics.log('Error: Did not get device language. Try testing on a device.');
                dayOfWeek[0] = 'Null';
                dayOfWeek[1] = 'Null';
                dayOfWeek[2] = 'Null';
                dayOfWeek[3] = 'Null';
                dayOfWeek[4] = 'Null';
                dayOfWeek[5] = 'Null';
                dayOfWeek[6] = 'Null';
                break;
        }



        var texturesArray = [SundayTexture, MondayTexture, TuesdayTexture, WednesdayTexture, ThursdayTexture, FridayTexture, SaturdayTexture];
        var textures = texturesArray.slice(0, 7);


        var now = new Date();


        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];


        const fullDateArray = now.toDateString().split(",").join("").split(" ");

        var weekdayNumber = now.getDay();
        var monthNumber = now.getMonth();
        var dateNumber = now.getDate();
        var yearNumber = now.getFullYear();

        var weekdayString = dayOfWeek[weekdayNumber];
        var monthString = monthNames[monthNumber].toString();

        var dateString = fullDateArray[2];
        var yearString = fullDateArray[3];


        DynamicWeekdayMaterial.getDiffuse = textures[weekdayNumber];


        Patches.inputs.setScalar('WeekdayNumber', weekdayNumber);

        Patches.inputs.setString('MonthString', monthString);
        Patches.inputs.setScalar('MonthNumber', monthNumber);

        Patches.inputs.setString('DateString', dateString);
        Patches.inputs.setScalar('DateNumber', dateNumber);

        Patches.inputs.setString('YearString', yearString);
        Patches.inputs.setScalar('YearNumber', yearNumber);
        Patches.inputs.setString('WeekdayString', weekdayString);




        var exactTime;
        var pulsed;

        Patches.outputs.getPulse('RefreshTimePulse').then(event => {
            pulsed = event.subscribe(function () {
                var now = new Date();
                var h = now.getHours();
                var m = now.getMinutes();
                var s = now.getSeconds();
                var ms = now.getMilliseconds();
                exactTime = h.toString().concat(":").concat(m.toString()).concat(":").concat(s.toString()).concat(":").concat(ms.toString())

                Patches.inputs.setString('HourMinSecMs', exactTime);

            });
        });
    });

})();


