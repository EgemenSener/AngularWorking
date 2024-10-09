import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, ChartEvent, registerables } from 'chart.js';
import { DataService } from '../app.service'; // Import your service

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {

  isBrowser: boolean;
  categoryData: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private dataService: DataService // Inject the service
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.getCategoryData();
    }
  }

  public showPieChart = false;
  
  getCategoryData(): void {
    this.dataService.getCategoryData().subscribe(data => {
      const barChart1 = document.getElementById('barChart1') as HTMLCanvasElement;
      new Chart(barChart1, {
        type: 'bar',  // Bar chart
        data: {
          labels: data.map(item => item.category),
          datasets: [{
            label: '# of Votes',
            data: data.map(item => item.count),
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)'
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true  // Ensure y-axis starts at 0
            }
          },
          responsive: true,
          onClick: (event: ChartEvent, activeElements: any[], chart: Chart) => {
            this.onChartClick(event, chart);
          },
        }
      });
    });
  }

  onChartClick(event: ChartEvent, chart: Chart): void {
    const pieChart1 = document.getElementById('pieChart1') as HTMLCanvasElement;
    new Chart(pieChart1, {
      type: 'pie',
      data: {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    });
    const chartInstance = chart;
    if (event.native) {
      const points = chartInstance.getElementsAtEventForMode(
        event.native as Event, 'nearest', { intersect: true }, true
      );

      if (points.length) {
        const firstPoint = points[0];
        const datasetIndex = firstPoint.datasetIndex;
        const dataIndex = firstPoint.index;

        // Logging label and value to check the values being clicked
        const label = chartInstance.data.labels?.[dataIndex];
        const value = chartInstance.data.datasets[datasetIndex].data[dataIndex];
        console.log('Clicked label:', label);
        console.log('Clicked value:', value);

        if (label && value !== undefined) {
          this.updatePieChart(label as string, value as number);
        }
      }
    }
  }

  updatePieChart(label: string, value: number): void {
    //this.pieChartData.labels = [label]; // Set the clicked label
    //this.pieChartData.datasets[0].data = [value]; // Set the clicked value
    // Force the pie chart to re-render
    this.showPieChart = false;
    setTimeout(() => {
      this.showPieChart = true;
    }, 0);
  }
}
