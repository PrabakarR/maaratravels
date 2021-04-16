import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    //togglemenu
let navColl = document.querySelector('.navbar-collapse');
let bartoggler = document.querySelector('.bar-toggler');
bartoggler.addEventListener("click", function(){
  bartoggler.classList.toggle('opened');
});




$(document).on('click', '.trvead .nav-link', function(e) {
  bartoggler.classList.remove('opened');
  navColl.classList.remove('show');
});

}

}
