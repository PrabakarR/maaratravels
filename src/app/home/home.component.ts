import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
declare var bootbox: any;
declare var $: any;
import * as moment from "moment";
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
  chooseHours:any;
  constructor(private spinner: NgxSpinnerService,
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
    vm.tarrifObj = {
      "localBasedHours": [{
        "car_type": "MINI",
        "two_hours": "400 (With in 20KM)",
        "three_hours": "600 (With in 30KM)",
        "four_hours": "800 (With in 40KM)",
        "five_hours": "1000 (With in 50KM)",
        "addition_rate_per_hours": "200",
        "addition_rate_per_km": "20"
      },{
        "car_type": "SEDAN",
        "two_hours": "500 (With in 20KM)",
        "three_hours": "720 (With in 30KM)",
        "four_hours": "940 (With in 40KM)",
        "five_hours": "1160 (With in 50KM)",
        "addition_rate_per_hours": "220",
        "addition_rate_per_km": "22"
      },{
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
    else if(vm.selectedTarrif && (vm.isEmpty(vm.chooseVehicle) || vm.isEmpty(vm.chooseRoute))) {
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
      let postData = {
        "subject": "Your booking at maara travels is confirmed – Confirmation #" + orderId + "",
        "to": [{
          "name": vm.name,
          "email": vm.email
        }],
        "from": {
          "name": "Maara Travels",
          "email": "velmurugan@maaratravels.com"
        },
        "cc": [{
          "email": "velmurugan@maaratravels.com"
        }],
        "bcc": [{
          "email": "kcsstalin@gmail.com"
        }],
        "template_id": "bookingsummary",
        "variables": {
          "VAR1": orderId,
          "VAR2": vm.name,
          "VAR3": vm.email,
          "VAR4": vm.phoneNumber,
          "VAR5": vm.pickupDate,
          "VAR6": vm.pickupTime,
          "VAR7": vm.source,
          "VAR8": vm.destination,
          "VAR9": vm.chooseVehicle,
          "VAR10": vm.chooseRoute,
          "VAR11": "Your selected tarrif plan based on rate per km : Rs." + vm.selectedTarrif.rate_per_km + " and driver bata is : Rs." + vm.selectedTarrif.driver_bata + "."
        },
        "authkey": "358909AN9lkBEjw01U607972e5P1"
      }
      let body = JSON.stringify(postData);
      console.log(body);
      vm.spinner.hide();
      vm.router.navigate(['/thankyou'], { queryParams: { orderId: orderId } });
    }
  }

}
