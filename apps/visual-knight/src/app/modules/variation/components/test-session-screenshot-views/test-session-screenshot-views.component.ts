import { Component, OnInit, Output, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { MatSlideToggleChange, MatDialog } from '@angular/material';
import { TestSessionType, TestType, VariationType } from '../../../core/types';
import { differenceInHours, parseISO, formatDistanceToNow } from 'date-fns';
import { DrawAreaComponent } from '../modals/draw-area/draw-area.component';
import { ScreenshotImagePipe } from '../../../shared/pipes/screenshot-image.pipe';

@Component({
  selector: 'visual-knight-test-session-screenshot-views',
  templateUrl: './test-session-screenshot-views.component.html',
  styleUrls: ['./test-session-screenshot-views.component.scss']
})
export class TestSessionScreenshotViewsComponent implements OnInit, OnChanges {
  @Input() testSession: TestSessionType;
  @Input() testName: String;
  @Input() variation: VariationType;
  @Output() accept: EventEmitter<boolean> = new EventEmitter();

  public isDiffView = false;
  public datetimeString: string;

  constructor(private dialog: MatDialog, private imagePipe: ScreenshotImagePipe) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.testSession) {
      const testSession: TestSessionType = changes.testSession.currentValue;
      this.isDiffView =
        testSession.diffImageKey !== null && testSession.misMatchPercentage > testSession.misMatchTolerance;
      if (differenceInHours(parseISO(testSession.createdAt), new Date()) <= 35) {
        this.datetimeString = formatDistanceToNow(parseISO(testSession.createdAt), {
          addSuffix: true
        });
      } else {
        this.datetimeString = null;
      }
    }
  }

  isUnresolved() {
    // TODO: get state instead of string
    return this.testSession.state === 'UNRESOLVED';
  }

  onSliderChanged(value: MatSlideToggleChange) {
    this.isDiffView = value.checked;
  }

  onClickAcceptButton() {
    this.accept.emit(true);
  }

  onClickDeclineButton() {
    this.accept.emit(false);
  }

  drawViewToggle() {
    this.dialog.open(DrawAreaComponent, {
      data: {
        variationId: this.variation.id,
        imageUrl: this.imagePipe.transform(this.testSession.imageKey),
        ignoreAreas: this.variation.ignoreAreas
      }
    });
  }
}
