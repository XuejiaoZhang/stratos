import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

export interface IStepperStep {
  validate: Observable<boolean>;
  onNext: StepOnNextFunction;
  onEnter?: (data?: any) => void;
}

export interface StepOnNextResult {
  success: boolean;
  message?: string;
  // Should we redirect to the store previous state?
  redirect?: boolean;
  // Ignore the result of a successful `onNext` call. Handy when sometimes you want to avoid navigation/step change
  ignoreSuccess?: boolean;
  data?: any;
}

export type StepOnNextFunction = () => Observable<StepOnNextResult>;

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StepComponent {

  public _onEnter: (data?: any) => void;
  active = false;
  complete = false;
  error = false;
  busy = false;

  _hidden = false;

  @Input()
  title: string;

  @Output() onHidden = new EventEmitter<boolean>();

  @Input('hidden')
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this.onHidden.emit(this._hidden);
  }

  get hidden() {
    return this._hidden;
  }

  @Input('valid')
  valid = true;

  @Input('canClose')
  canClose = true;

  @Input('nextButtonText')
  nextButtonText = 'Next';

  @Input('finishButtonText')
  finishButtonText = 'Finish';

  @Input('cancelButtonText')
  cancelButtonText = 'Cancel';

  @Input('disablePrevious')
  disablePrevious = false;

  @Input('blocked')
  blocked = false;

  @Input('destructiveStep')
  public destructiveStep = false;

  @ViewChild(TemplateRef)
  content: TemplateRef<any>;

  @Input()
  skip = false;

  @Input()
  onNext: StepOnNextFunction = () => observableOf({ success: true })

  @Input()
  onEnter: (data: any) => void = () => { }

  @Input()
  onLeave: (isNext?: boolean) => void = () => { }

  constructor() {
    this._onEnter = (data?: any) => {
      if (this.destructiveStep) {
        this.busy = true;
        setTimeout(() => {
          this.busy = false;
        }, 1000);
      }
      this.onEnter(data);
    };
  }

}
