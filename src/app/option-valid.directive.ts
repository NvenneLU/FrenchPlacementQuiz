import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appOptionValid][formControlName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OptionValidDirective), multi: true }
  ]
})
export class OptionValidDirective implements Validator{

  constructor( @Attribute('validateOption') public validateOption: string) { }

  validate(c: AbstractControl): { [key: string]: any } {
    let option: string = c.value;
    let words: string[] = c.root.get(this.validateOption).value.split(" ");
    console.log(option + " " + words);
    if(!words.some(word => word === option)) {
      return {
        validateOption: false
      }
    }
    return null;

  }
}
