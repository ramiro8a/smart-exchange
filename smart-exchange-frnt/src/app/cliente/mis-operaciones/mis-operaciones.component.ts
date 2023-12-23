import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import { OperacionService, PaginaOperacionResponse, OperacionResponse  } from 'src/app/rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-mis-operaciones',
  templateUrl: './mis-operaciones.component.html',
  styleUrls: ['./mis-operaciones.component.sass']
})
export class MisOperacionesComponent implements OnInit{
  estaCargando: boolean = false
  criterioForm: FormGroup;
  dataSource: OperacionResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','ticket','estado', 'tipoTransferencia','monto', 'montoFinal','codigoTransferencia','cliente','origen','destino','transferencia','opciones'];
  paginable: any
  filasInicial: number=5
  paginaInicial: number=0
  hoy = new Date();
  fechaFormateada = this.hoy.toISOString().split('T')[0];
  constructor(
    private dialog: MatDialog,
    private restOperacion:OperacionService,
    private notif: NotifierService,
    private formBuilder: FormBuilder,
    ){
      this.criterioForm = this.formBuilder.group({
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        ticket: [''],
      });
    }

  ngOnInit(): void {
    this.recuperaInicial();
  }

  resetForm(){
    this.criterioForm.setValue({
      inicio: this.fechaFormateada,
      fin: this.fechaFormateada,
      ticket:''
    });
  }
  recuperaInicial(){
    this.resetForm()
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.restOperacion.recuperaOperacionesPaginado(pagina, filas, this.criterioForm.value).subscribe({
      next: (response:PaginaOperacionResponse) => {
        this.dataSource = response.content
        this.paginable = response
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

  buscar():void{
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

}
