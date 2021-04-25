import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  orderId:any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params);
        this.orderId = params.orderId;
      }
    );
  }

}
