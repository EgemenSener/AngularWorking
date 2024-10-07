import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DataService } from '../app.service'; // Import your service

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  // Now we have two chart data sets
  public barChartData1: ChartConfiguration<'bar'>['data'] = {
    labels: [], // Will be populated with category names for Chart 1
    datasets: [
      {
        data: [], // Will be populated with category counts for Chart 1
        label: 'Category Count 1',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  public barChartData2: ChartConfiguration<'bar'>['data'] = {
    labels: [], // Will be populated with category names for Chart 2
    datasets: [
      {
        data: [], // Will be populated with category counts for Chart 2
        label: 'Category Count 2',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private dataService: DataService // Inject the service
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.getCategoryData(); // Call the method to get data on initialization
  }

  getCategoryData(): void {
    this.dataService.getCategoryData().subscribe(data => {
      // Assuming we want to use the same data but process it differently for two charts
      this.barChartData1.labels = data.map(item => item.category); // Extract category names for Chart 1
      this.barChartData1.datasets[0].data = data.map(item => item.count); // Extract category counts for Chart 1

      // Example: Creating different data for Chart 2 by multiplying counts by 2
      this.barChartData2.labels = data.map(item => item.category); // Extract category names for Chart 2
      this.barChartData2.datasets[0].data = data.map(item => item.count * 2); // Extract modified counts for Chart 2
    });
  }
}
