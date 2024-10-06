import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BaseChartDirective } from 'ng2-charts'; // For newer versions
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // Provide chart configuration
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent, ChartComponent
  ],
  imports: [
    BrowserModule,
    BaseChartDirective,
    CommonModule // Ensure this is imported correctly
  ],
  providers: [
    provideCharts(withDefaultRegisterables()) // Set up the default chart components
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
