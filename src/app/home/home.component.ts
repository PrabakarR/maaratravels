import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
declare var bootbox: any;
declare var $: any;
import * as moment from "moment";
import { ApiService } from '../services/api.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    tarrifObj: any;
    name: any;
    phoneNumber: any;
    email: any;
    pickupDate: Date = new Date();
    pickupTime: any;
    source: any;
    destination: any;
    chooseVehicle: any;
    chooseRoute: any;
    minDate = new Date();
    selectedTarrif: any;
    mytime: Date = new Date();
    chooseHours: any;
    description: any;
    distanceInfo: any;
    carRoutes: any
    constructor(private spinner: NgxSpinnerService,
        public service: ApiService,
        public toastr: ToastrService,
        public router: Router) {
        let vm = this;
        vm.pickupTime = moment(vm.mytime).format('LT');
        vm.chooseVehicle = '';
        vm.chooseRoute = '';
        vm.chooseHours = '';
    }
    changed(event): void {
        console.log(event);
        let vm = this;
        vm.pickupTime = moment(event).format('LT');
    }
    calcDistanceInfo() {
        let vm = this;
        if (!vm.isEmpty(vm.source) && !vm.isEmpty(vm.destination)) {
            // To allow minimum three character
            if (vm.source.toString().length < 3 || vm.destination.toString().length < 3) {
                vm.errorMsg('Oops,Invalid inputs!');
            }
            else {
                vm.spinner.show();
                vm.service
                    .getDistanceInfo(vm.source, vm.destination)
                    .subscribe((data: any) => {
                        vm.spinner.hide();
                        if (data.status == "OK") {
                            // console.log(data);
                            if (data.rows[0].elements[0].distance.value == 0) {
                                vm.distanceInfo = '';
                                vm.errorMsg('Oops,Invalid inputs!');
                            }
                            else {
                                vm.distanceInfo = {};
                                vm.distanceInfo["origin"] = data.origin_addresses[0];
                                vm.distanceInfo["destination"] = data.destination_addresses[0];
                                vm.distanceInfo["distance"] = data.rows[0].elements[0].distance;
                                vm.distanceInfo["duration"] = data.rows[0].elements[0].duration;
                                let totalKm = Math.floor(data.rows[0].elements[0].distance.value / 1000);
                                if (totalKm <= 100) {
                                    vm.carRoutes = [{
                                        "value": "localBasedHours",
                                        "text": "Local-based on hours"
                                    },
                                    {
                                        "value": "Local",
                                        "text": "Local-pick up and drop"
                                    }];
                                }
                                else {
                                    vm.carRoutes = [
                                        {
                                            "value": "One way",
                                            "text": "One way"
                                        },
                                        {
                                            "value": "Round Trip",
                                            "text": "Round Trip"
                                        }
                                    ];
                                }
                            }
                        }
                        else {
                            console.log(data);
                        }
                        console.log(vm.distanceInfo);
                    });
            }
        }
    }
    ngOnInit(): void {
        let vm = this;
        let scrolltoOffset = $('#header').outerHeight() - 17;
        $(document).on('click', '.scrollto', function (e) {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                if (target.length) {
                    e.preventDefault();

                    var scrollto = target.offset().top - scrolltoOffset;

                    if ($(this).attr("href") == '#header') {
                        scrollto = 0;
                    }

                    $('html, body').animate({
                        scrollTop: scrollto
                    }, 1000);

                    if ($(this).parents('.navbar-nav').length) {
                        $('.scrollto').removeClass('active');
                        $(this).closest('li > a').addClass('active');
                    }
                    return false;
                }
            }
        });
        vm.carRoutes = [];
        vm.tarrifObj = {
            "localBasedHours": [{
                "car_type": "MINI",
                "two_hours": "400 (With in 20KM)",
                "three_hours": "600 (With in 30KM)",
                "four_hours": "800 (With in 40KM)",
                "five_hours": "1000 (With in 50KM)",
                "addition_rate_per_hours": "200",
                "addition_rate_per_km": "20"
            }, {
                "car_type": "SEDAN",
                "two_hours": "500 (With in 20KM)",
                "three_hours": "720 (With in 30KM)",
                "four_hours": "940 (With in 40KM)",
                "five_hours": "1160 (With in 50KM)",
                "addition_rate_per_hours": "220",
                "addition_rate_per_km": "22"
            }, {
                "car_type": "XUV",
                "two_hours": "700 (With in 20KM)",
                "three_hours": "1000 (With in 30KM)",
                "four_hours": "1300 (With in 40KM)",
                "five_hours": "1600 (With in 50KM)",
                "addition_rate_per_hours": "300",
                "addition_rate_per_km": "28"
            }],
            "local": [{
                "car_type": "MINI",
                "mini_charge": "200 (With in 10KM)",
                "addition_rate_per_km": "20"
            }, {
                "car_type": "SEDAN",
                "mini_charge": "250 (With in 10KM)",
                "addition_rate_per_km": "22"
            }, {
                "car_type": "XUV",
                "mini_charge": "350 (With in 10KM)",
                "addition_rate_per_km": "30"
            }],
            "oneway": [{
                "car_type": "MINI",
                "mini_charge": "1690 (With in 130KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "13"
            }, {
                "car_type": "SEDAN",
                "mini_charge": "1820 (With in 130KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "14"
            }, {
                "car_type": "XUV",
                "mini_charge": "2340 (With in 130KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "18"
            }],
            "roundtrip": [{
                "car_type": "MINI",
                "mini_charge": "2500 (With in 250KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "10"
            }, {
                "car_type": "SEDAN",
                "mini_charge": "2750 (With in 250KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "11"
            }, {
                "car_type": "XUV",
                "mini_charge": "3500 (With in 250KM)",
                "driver_bata": "500",
                "addition_rate_per_km": "14"
            }]
        }
    }
    isEmpty(val) {
        return (val === 0 || val === '0' || val === false || val === '' || val === undefined || val == null || val.length <= 0) ? true : false;
    }
    isInArray(value) {
        var array = ["0000000000", "1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666", "7777777777", "8888888888", "9999999999"];
        return array.indexOf(value) > -1;
    }
    errorMsg(msg) {
        let vm = this;
        vm.toastr.error(msg)
        // bootbox.alert({
        //   message: msg,
        //   backdrop: true
        // });
    }
    isString(event: any) {
        let newValue = event.target.value;
        let regExp = new RegExp('^[A-Za-z? ]+$');
        if (!regExp.test(newValue)) {
            event.target.value = newValue.slice(0, -1);
        }
    }
    isNumber(event: any) {
        let newValue = event.target.value;
        let regExp = new RegExp('^[0-9? ]+$');
        if (!regExp.test(newValue)) {
            event.target.value = newValue.slice(0, -1);
        }
    }
    onOptionsSelected() {
        let vm = this;
        if (!vm.isEmpty(vm.chooseVehicle) && !vm.isEmpty(vm.chooseRoute)) {
            vm.selectedTarrif = {};
            let selectedRoute = vm.chooseRoute == "localBasedHours" ? "localBasedHours" : vm.chooseRoute == "Local" ? "local" : vm.chooseRoute == "One way" ? "oneway" : "roundtrip";
            let chooseTarrif = vm.tarrifObj[selectedRoute];
            // console.log(chooseTarrif);
            for (let index = 0; index < chooseTarrif.length; index++) {
                if (chooseTarrif[index].car_type == vm.chooseVehicle) {
                    vm.selectedTarrif = chooseTarrif[index];
                }
            }
            console.log(vm.selectedTarrif);
        }
        else if (vm.selectedTarrif && (vm.isEmpty(vm.chooseVehicle) || vm.isEmpty(vm.chooseRoute))) {
            vm.selectedTarrif = {};
        }
        else {

        }
    }
    bookConfirm() {
        let vm = this;
        let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (vm.isEmpty(vm.name)) {
            vm.errorMsg('Please enter your name!');
        } else if (vm.isEmpty(vm.phoneNumber)) {
            vm.errorMsg('Please enter your phone number!');
        } else if (vm.phoneNumber.toString().length != 10) {
            vm.errorMsg('Please enter a valid mobile number!');
        } else if ((vm.phoneNumber.charAt(0) == 1) || (vm.phoneNumber.charAt(0) == 2) || (vm.phoneNumber.charAt(0) == 3) || (vm.phoneNumber.charAt(0) == 4) || (vm.phoneNumber.charAt(0) == 5)) {
            vm.errorMsg('Please enter a valid mobile number!');
        } else if (vm.isInArray(vm.phoneNumber)) {
            vm.errorMsg("Please enter a valid mobile number!");
        } else if (vm.isEmpty(vm.email)) {
            vm.errorMsg('Please enter a your email!');
        } else if (!reg.test(vm.email.replace(/\s+/g, ''))) {
            vm.errorMsg('Please enter a valid your email!');
        } else if (vm.isEmpty(vm.pickupDate)) {
            vm.errorMsg('Please choose a pick-up date!');
        } else if (vm.isEmpty(vm.pickupTime)) {
            vm.errorMsg('Please choose a pick-up time!');
        } else if (vm.isEmpty(vm.source)) {
            vm.errorMsg('Please enter a source(from)!');
        } else if (vm.isEmpty(vm.destination)) {
            vm.errorMsg('Please enter a destination(to)!');
        } else if (vm.isEmpty(vm.chooseVehicle)) {
            vm.errorMsg('Please choose a vehicle mode');
        } else if (vm.isEmpty(vm.chooseRoute)) {
            vm.errorMsg('Please choose a route mode');
        } else {
            vm.spinner.show();
            let orderId = "MT-" + new Date().getTime();
            let selectedRoute = vm.chooseRoute == "localBasedHours" ? "Local-based on hours" : vm.chooseRoute == "Local" ? "Local-pick up and drop" : vm.chooseRoute == "One way" ? "One way" : "Round Trip";
            if (vm.chooseRoute == 'localBasedHours') {
                vm.description = "Your selected route and vehicle based on tariff information : 2 Hours: Rs." + vm.selectedTarrif.two_hours + ",3 Hours: Rs." + vm.selectedTarrif.three_hours + ",4 Hours: Rs." + vm.selectedTarrif.four_hours + ",5 Hours: Rs." + vm.selectedTarrif.five_hours + ", Rate Per Hours: Rs." + vm.selectedTarrif.addition_rate_per_hours + ", and Rate Per KM: Rs." + vm.selectedTarrif.addition_rate_per_km + ""
            }
            else if (vm.chooseRoute == 'Local') {
                vm.description = "Your selected route and vehicle based on tariff information: Minimum Charge: Rs." + vm.selectedTarrif.mini_charge + " and Rate Per KM: Rs." + vm.selectedTarrif.addition_rate_per_km + ""
            }
            else if (vm.chooseRoute == 'One way') {
                vm.description = "Your selected route and vehicle based on tariff information: Minimum Charge: Rs." + vm.selectedTarrif.mini_charge + ", Rate Per KM: Rs." + vm.selectedTarrif.addition_rate_per_km + ", and Driver Bata: Rs." + vm.selectedTarrif.driver_bata + ""
            }
            else if (vm.chooseRoute == 'Round Trip') {
                vm.description = "Your selected route and vehicle based on tariff information: Minimum Charge: Rs." + vm.selectedTarrif.mini_charge + ", Rate Per KM: Rs." + vm.selectedTarrif.addition_rate_per_km + ", and Driver Bata: Rs." + vm.selectedTarrif.driver_bata + ""
            }
            else {

            }
            const htmlContent = `
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mailer</title>
</head>

<body spellcheck="false"
    style='width: 100%; font-family: roboto, "helvetica neue", helvetica, arial, sans-serif; text-size-adjust: 100%; padding: 0px; margin: 0px;'>
    <div class="es-wrapper-color" style="background-color:#E6E7E8;">

        <table border="0" cellpadding="0" cellspacing="0" height="100%"
            style="border-collapse:collapse;table-layout:fixed;margin:0 auto;border-spacing:0;padding:0;height:100%!important;width:100%!important;font-weight:normal;color:#3e4152;font-family:'roboto',Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;"
            width="100%">
            <tbody>
                <tr>
                    <td style="background:#ffffff;padding:16px 0;">

                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                            style="max-width:600px;margin:auto;border-spacing:0;background:#006699;padding:4px;border-radius:0px;overflow:hidden;"
                            width="100%">
                            <tbody>
                                <tr>
                                    <td style="border-collapse:collapse;">

                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                            style="margin:auto;border-spacing:0;background:white;border-radius:0px;overflow:hidden;"
                                            width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="border-collapse:collapse;">

                                                        <table bgcolor="#ffffff" border="0" cellpadding="0"
                                                            cellspacing="0"
                                                            style="border-spacing:0;border-collapse:collapse;"
                                                            width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:16px 32px;"
                                                                        valign="middle">

                                                                        <table bgcolor="#ffffff" border="0"
                                                                            cellpadding="0" cellspacing="0"
                                                                            style="border-spacing:0;border-collapse:collapse;"
                                                                            width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="padding:0;text-align:left;border-collapse:collapse;"
                                                                                        valign="middle" width="40">
                                                                                        <a data-saferedirecturl="https://maaratravels.com/"
                                                                                            href="https://maaratravels.com/"
                                                                                            style="text-decoration:none;color:#ffffff;outline:0;outline:none;border:0;border:none;"
                                                                                            target="_blank"><img
                                                                                                src="https://maaratravels.com/assets/images/logo2.png"
                                                                                                title="maaratravels"
                                                                                                alt="maaratravels"
                                                                                                style="margin: auto; text-align: center; border: 0px; outline: none; text-decoration: none; min-height: 40px;"
                                                                                                align="middle"
                                                                                                border="0" width="40"
                                                                                                class="CToWUd"></a>
                                                                                    </td>
                                                                                    <td align="center"
                                                                                        style="color: #006699;font-size: large;"
                                                                                        valign="middle">MAARA TRAVELS
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse:collapse;padding:0 16px;">

                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            style="background:#f7f9fa;padding:16px;border-radius:8px;overflow:hidden;"
                                                            width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Order
                                                                                        ID</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;font-size:16px;color:#5eaa46;"
                                                                                        valign="top">`+ orderId + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Name
                                                                                    </td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.name + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Phone
                                                                                        number</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.phoneNumber + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Email
                                                                                        ID</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.email + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Pickup Date
                                                                                    </td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ moment(vm.pickupDate).format('YYYY-MM-DD') + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Pickup 
                                                                                        Time</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.pickupTime + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">
                                                                                        Pickup Place</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.source + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">
                                                                                        Drop Place</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.destination + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                <td align="left"
                                                                    style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                    valign="middle">

                                                                    <table align="center" border="0" cellpadding="0"
                                                                        cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="left"
                                                                                    style="border-collapse:collapse;text-transform:capitalize;"
                                                                                    valign="top" width="28%">
                                                                                    Travel Distance</td>
                                                                                <td align="left"
                                                                                    style="border-collapse:collapse;font-weight:normal;"
                                                                                    valign="top" width="16">:</td>
                                                                                <td align="left"
                                                                                    style="border-collapse:collapse;font-weight:normal;"
                                                                                    valign="top">`+ vm.distanceInfo.distance.text + `
                                                                                    <br>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            <td align="left"
                                                                style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                valign="middle">

                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" width="100%">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td align="left"
                                                                                style="border-collapse:collapse;text-transform:capitalize;"
                                                                                valign="top" width="28%">
                                                                                Travel Duration </td>
                                                                            <td align="left"
                                                                                style="border-collapse:collapse;font-weight:normal;"
                                                                                valign="top" width="16">:</td>
                                                                            <td align="left"
                                                                                style="border-collapse:collapse;font-weight:normal;"
                                                                                valign="top">`+ vm.distanceInfo.duration.text + `
                                                                                <br>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Route
                                                                                        Mode</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ selectedRoute + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0;border-bottom:1px solid #eaeaed;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;text-transform:capitalize;"
                                                                                        valign="top" width="28%">Vehicle
                                                                                        Type</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.chooseVehicle + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left"
                                                                        style="border-collapse:collapse;padding:8px 0 0;font-size:14px;"
                                                                        valign="middle">

                                                                        <table align="center" border="0" cellpadding="0"
                                                                            cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;"
                                                                                        valign="top" width="28%">Description
                                                                                    </td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top" width="16">:</td>
                                                                                    <td align="left"
                                                                                        style="border-collapse:collapse;font-weight:normal;"
                                                                                        valign="top">`+ vm.description + `
                                                                                        <br>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="border-collapse:collapse;padding:16px 32px;border-top:1px solid #eaeaed;font-family:'roboto',Arial,Helvetica,sans-serif;font-size:12px;">

                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" style="border-collapse:collapse;"
                                                                        valign="middle">

                                                                        <table border="0" cellpadding="0"
                                                                            cellspacing="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td
                                                                                        style="border-collapse:collapse;font-size: 15px; padding-bottom: 12px; font-weight: bold;background:#ffffff;font-family:'roboto',Arial,Helvetica,sans-serif;">

                                                                                        <p style="padding:0;margin:0;">
                                                                                            For any booking related
                                                                                            queries, please reach out to
                                                                                            maara travels at</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td
                                                                                        style="border-collapse:collapse;">
                                                                                        <a href="tel:+919176055884"
                                                                                            style="font-size:0;border:0;outline:0;border:none;outline:none;text-decoration:none;margin-right:20px;"><img
                                                                                                width="30"
                                                                                                src="https://maaratravels.com/assets/images/icons/call.svg"
                                                                                                title="call" alt="call"
                                                                                                class="CToWUd"></a>
                                                                                        <a data-saferedirecturl="https://wa.me/919176055884"
                                                                                            href="https://wa.me/919176055884"
                                                                                            style="font-size:0;border:0;outline:0;border:none;outline:none;text-decoration:none;margin-right:4px;"
                                                                                            target="_blank"><img
                                                                                                width="30"
                                                                                                src="https://maaratravels.com/assets/images/icons/whatsapp.svg"
                                                                                                title="whatsapp"
                                                                                                alt="whatsapp"
                                                                                                class="CToWUd"></a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`
            let postData = {
                "to": [{
                    "name": vm.name,
                    "email": vm.email
                }],
                "from": {
                    "name": "Maara Travels",
                    "email": "velmurugan@maaratravels.com"
                },
                "subject": "Your booking at maara travels is confirmed – Confirmation #" + orderId + "",
                "body": {
                    "data": htmlContent.toString(),
                    "type": "text/html"
                },
                "cc": [{
                    "email": "velmurugan@maaratravels.com"
                }],
                "bcc": [{
                    "email": "kcsstalin@gmail.com"
                }],
                "mail_type_id": "1",
                "authkey": "358909AN9lkBEjw01U607972e5P1"
            }
            let body = JSON.stringify(postData);
            console.log(body);
            // vm.spinner.hide();
            vm.service.sendEmail(postData).subscribe((data: any) => {
                vm.spinner.hide();
                if (data.status == "success") {
                    // vm.toastr.info('Order placed successfully', 'Congratulations');
                    vm.router.navigate(['/thankyou'], { queryParams: { orderId: orderId } });
                }
                else {
                    alert(data.message)
                }
            });
        }
    }

}
