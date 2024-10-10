import { Component, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../app.service';

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
  public showPieChart = false;
  pieChartInstance: any;
  chart: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private dataService: DataService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.getCategoryData();
    }
  }

  getCategoryData(): void {
    this.dataService.getCategoryData().subscribe(data => {
      this.categoryData = data;
      console.log(data);
      const barChart1 = document.getElementById('barCharPlanlanmis') as HTMLCanvasElement;
      this.chart = new Chart(barChart1, {
        type: 'bar',
        data: {
          labels: data.map(item => item.itemCode),
          datasets: [{
            label: 'Üretim Siparişleri Sayısı',
            data: data.map(item => item.totalQty),
            borderWidth: 1,
            backgroundColor: 'rgba(179, 31, 36, 0.9)',
            borderColor: '#b31f24',
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true,
          onClick: () => {
            barChart1.onclick = (event) => {
              const activePoints = this.chart.getElementsAtEventForMode(
                event,
                'nearest',
                { intersect: true },
                true
              );

              if (activePoints.length) {
                const dataIndex = activePoints[0].index;
                // categoryData dizisinden o index'e karşılık gelen veriyi alalım
                const clickedData = this.categoryData[dataIndex];
                console.log("Tıklanan Veri:", clickedData);
                this.createOrUpdatePieChart(event, clickedData);
              };
            }
          }
        }
      });
    });
  }

  createOrUpdatePieChart(event: any, clickedData: any): void {
    const pieChart1 = document.getElementById('pieChart1') as HTMLCanvasElement;
    if (!this.showPieChart) {
      this.pieChartInstance = new Chart(pieChart1, {
        type: 'pie',
        data: {
          labels: clickedData.companies.map((item: { cardName: any; }) => item.cardName),
          datasets: [{
            label: 'Şirket Dağılımı',
            data: clickedData.companies.map((item: {
              plannedQty: any; cardName: any
            }) => item.plannedQty),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        }
      });
      this.showPieChart = true
    } else {
      this.pieChartInstance.data.labels = clickedData.companies.map((item: { cardName: any; }) => item.cardName);
      this.pieChartInstance.data.datasets[0].data = clickedData.companies.map((item: { plannedQty: any; }) => item.plannedQty);
      this.pieChartInstance.update();
    }
    const parentNode = this.chart.canvas.parentNode as HTMLElement;
    parentNode.style.width = '40vh';
  }
}
