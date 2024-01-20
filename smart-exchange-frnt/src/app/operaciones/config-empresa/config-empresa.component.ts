import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { EmpresaService, Empresa, Dia } from 'src/app/rest/empresa.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-config-empresa',
  templateUrl: './config-empresa.component.html',
  styleUrls: ['./config-empresa.component.sass']
})
export class ConfigEmpresaComponent implements OnInit {
  estaCargandoEmpresa:boolean = false
  estaCargandoDias:boolean = false
  empresaForm: FormGroup;
  empresa!: Empresa
  empresaOriginal!: Empresa
  horas:string[]=['06','07','08','09','10','11','12','13','14','15','16','17','18']
  minutos:string[]=['00','15','30','45']


  constructor(
    private formBuilder: FormBuilder,
    private restempresa: EmpresaService,
    private notif: NotifierService){
      this.empresaForm = this.formBuilder.group({
                razonSocial: ['', [Validators.required]],
                ruc: ['', [Validators.required]],
              });
  }

  ngOnInit(): void {
    this.recuperaEmpresa()
  }

  recuperaEmpresa(){
    this.estaCargandoEmpresa = true
    this.restempresa.recuperaEmpresa().subscribe({
      next: (response:Empresa) => {
        this.actualizaDatosEmpresa(response)
        this.empresaForm.setValue({
          razonSocial: this.empresa.razonSocial, ruc:this.empresa.ruc
        })
        this.empresaForm.disable()
        this.estaCargandoEmpresa = false
      },
      error: (error:any) => {
        this.notif.notify('error', error);
        this.estaCargandoEmpresa = false
      }
    });
  }

  guardarEmpresa(){
    if(this.empresaForm.valid){
      this.estaCargandoEmpresa = true
      this.restempresa.actualizaEmpresa(this.empresa.id, this.empresaForm.value).subscribe({
        next: (response:Empresa) => {
          this.actualizaDatosEmpresa(response)
          this.empresaForm.setValue({
            razonSocial: this.empresa.razonSocial, ruc:this.empresa.ruc
          })
          this.empresaForm.disable()
          this.estaCargandoEmpresa = false
        },
        error: (error:any) => {
          this.notif.notify('error', error);
          this.estaCargandoEmpresa = false
        }
      });
    }else{
      this.notif.notify('warning', 'Complete los datos');
    }
  }

  actualizaDatosEmpresa(empresa:Empresa):void{
    empresa.dias.forEach(dia => {
      dia.hayCambio = false
      if (dia.horario.desde) {
        const partesDesde = dia.horario.desde.split(":");
        dia.horario.tDesde = {
          hora: partesDesde[0],
          minuto: partesDesde[1]
        };
      }
      if (dia.horario.hasta) {
        const partesHasta = dia.horario.hasta.split(":");
        dia.horario.tHasta = {
          hora: partesHasta[0],
          minuto: partesHasta[1]
        };
      }
    });
    this.empresa = empresa
    this.empresaOriginal = JSON.parse(JSON.stringify(empresa));
  }

  actualizaDia(dia:Dia){
    dia.horario.desde = dia.horario.tDesde?.hora+':'+dia.horario.tDesde?.minuto+':00'
    dia.horario.hasta = dia.horario.tHasta?.hora+':'+dia.horario.tHasta?.minuto+':00'
    this.estaCargandoDias=true
    this.restempresa.actualizaDia(dia.id, dia).subscribe({
      next: (response:Empresa) => {
        this.actualizaDatosEmpresa(response)
        this.estaCargandoDias = false
      },
      error: (error:any) => {
        this.notif.notify('error', error);
        this.estaCargandoDias = false
      }
    });
  }

  resetDia(dia:Dia){
    this.empresaOriginal.dias.forEach((item)=>{
      if(dia.id==item.id){
        dia.horario = item.horario
        dia.hayCambio = item.hayCambio
        dia.laboral = item.laboral
      }
    })
  }

/*   this.empresa.dias.forEach((elemento)=>{
    if(elemento.id==dia.id){
      dia.laboral=item.laboral
      elemento.laboral=item.laboral
      elemento.horario.tDesde=item.horario.tDesde
      elemento.horario.tDesde!.minuto=item.horario.tDesde!.minuto
      elemento.horario.tHasta!.hora=item.horario.tHasta!.hora
      elemento.horario.tHasta!.minuto=item.horario.tHasta!.minuto
      console.warn(elemento.id +'---'+item.id)
      console.warn(elemento.nombre +'---'+item.nombre)
    }
  }) */

  hayCambiosConfirma(dia:Dia){
    dia.hayCambio=true
  }

  editarEmpresa(){
    this.empresaForm.enable()
  }

  cancelarEmpresa(){
    this.empresaForm.setValue({
      razonSocial: this.empresa.razonSocial, ruc:this.empresa.ruc
    })
    this.empresaForm.disable()
  }

}
