import {Component, OnInit, Input, Inject} from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  // @Input()
  additionalCommentForm: FormGroup;
  additionalComment: Comment;
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  };
  errMess: string;

  validationMessages = {
    'author': {
      'required': 'Author name is required',
      'minlength': 'Author name must be at least 2 characters long',
      'maxLength': 'Author name cannot be more than 25 character long'
    },
    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment must be at least 2 characters long',
      'maxLength': 'Comment cannot be more than 25 character long'
    }
  };

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL
  ) {
    this.createAdditionalCommentForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
        errMess => this.errMess = <any>errMess);
  }

  createAdditionalCommentForm() {
    this.additionalCommentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: '',
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
    console.log(this.additionalCommentForm);

    this.additionalCommentForm.valueChanges
      .subscribe(data => this.onValueChnaged(data));

    this.onValueChnaged(); // (re)set form validation messages
  }

  onValueChnaged(data?: any) {
    if (!this.additionalCommentForm) { return; }
    const form = this.additionalCommentForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '';
        }
      }
    }
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    console.log(this.next, this.prev);
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.additionalComment = this.additionalCommentForm.value;
    console.log(this.additionalComment);
    this.additionalCommentForm.reset({
      author: '',
      rating: '',
      comment: ''
    });
  }

}
