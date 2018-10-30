import { Component, Input } from '@angular/core';

/**
 * Represents a single chart drawing.
 *
 * @export
 * @class ChartComponent
 */
@Component({
  selector: 'chart-component',
  templateUrl: './chart.component.html',
})
export class ChartComponent  {

  @Input() public data: any;

  protected view: Array<number> = [700, 400];

  protected showXAxis: boolean =  true;
  protected showYAxis: boolean =  true;
  protected gradient: boolean =  false;
  protected showLegend: boolean =  true;
  protected showXAxisLabel: boolean =  true;
  protected showYAxisLabel: boolean =  true;
  protected xAxisLabel: string =  'Rounds';
  protected yAxisLabel: string =  'Rounds';
  protected autoScale: boolean = true;
  protected colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
}
