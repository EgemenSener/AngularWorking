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

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], // Will be populated with category names
    datasets: [
      {
        data: [], // Will be populated with category counts
        label: 'Category Count',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
      // Process data to extract labels and counts
      this.barChartData.labels = data.map(item => item.category); // Extract category names
      this.barChartData.datasets[0].data = data.map(item => item.count); // Extract category counts
    });
  }
}
