import {Component, Inject, OnInit} from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess: string;
  // selectedDish: Dish;

  constructor(private dishService: DishService,
              @Inject('BaseURL') public BaseURL) { }

  /*When ever this component executed this ngOnInit will get executed*/
  ngOnInit() {
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
        errMess => this.errMess = <any>errMess);
  }

  // onSelect(dish: Dish) {
  //   this.selectedDish = dish;
  // }

}
