import { Component, OnInit ,Input } from '@angular/core';
import { DatosCompartidosService } from '../services/datos-compartidos.service';
import { ModalController } from '@ionic/angular';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit{

  @Input() name?: string;
  correo:string=''

  constructor(
    private datosCompartidos: DatosCompartidosService,
    private modalCtrl: ModalController
  ){}

  ngOnInit(): void {
    this.datosCompartidos.correo$.subscribe(correo => {
      this.correo = correo;
    });
  }

  async configuraciones(){
    const modal = await this.modalCtrl.create({
      component: ConfiguracionesComponent
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
    }
  }

}
