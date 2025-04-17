import { Component, OnInit } from '@angular/core';
import { CouponsService } from 'src/app/services/coupons.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: any[] = [];
  public selectedProveedor: string = '';
  public selectedDiametro: string = '';
  public selectedSeccion: string = '';
  public selectedLlanta: string = '';
  public shortName: string | undefined;

  constructor(private couponService: CouponsService) {}

  ngOnInit() {
    // Puedes cargar productos al iniciar si quieres mostrar todos inicialmente
    // this.getAsProd();
  }

  getAsProd() {
    this.couponService.getAs(this.selectedDiametro).then(products => {
      console.log(products);
      // Filtrar productos por múltiples parámetros
      this.products = products.filter((product: { proveedor: string; diametro: string; seccion: string; llanta: string; }) => 
        (!this.selectedProveedor || product.proveedor === this.selectedProveedor) &&
        (!this.selectedDiametro || product.diametro === this.selectedDiametro) &&
        (!this.selectedSeccion || product.seccion === this.selectedSeccion) &&
        (!this.selectedLlanta || product.llanta === this.selectedLlanta)
      );
      
    });
  }
}
