import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cifrado',
  templateUrl: './cifrado.page.html',
  styleUrls: ['./cifrado.page.scss'],
})
export class CifradoPage {
  // Forms
  public claveForm = new FormGroup({
    primoP: new FormControl(107, Validators.required),
    generadorG: new FormControl(32, Validators.required),
    numeroK: new FormControl(49, Validators.required),
    numLetrasPorBloque: new FormControl(2, Validators.required),
  });

  public cifradoForm: FormGroup = new FormGroup({
    textoClaroInput: new FormControl('qwerty', Validators.required),
    aleatorioX: new FormControl(74, Validators.required),
    textoClaroFormateado: new FormControl(),
    pesosTextoClaroFormateado: new FormControl(),
    pesosCifradosOutput: new FormControl(),
  });

  public descifradoForm: FormGroup = new FormGroup({
    textoCifradoInput: new FormControl('', Validators.required),
    textoClaroOutput: new FormControl(),
  });

  // Flags
  public sonParametrosCorrectos = false;

  constructor(private alertCtrl: AlertController) {}

  verificarClave(): void {
    const primoP: number = +this.claveForm.get('primoP')?.value!;
    const generadorG: number = +this.claveForm.get('generadorG')?.value!;
    const numeroK: number = +this.claveForm.get('numeroK')?.value!;
    this.sonParametrosCorrectos = false;

    if (!this.esPrimo(primoP)) {
      return;
    }

    if (primoP <= 25) {
      this.notificacionError(
        `P debe ser mayor al número de letras del alfabeto`
      );
      return;
    }

    if (!this.esGenerador(generadorG, primoP)) {
      return;
    }

    if (!this.esPrimoRelativo(numeroK, primoP - 1)) {
      return;
    }

    this.sonParametrosCorrectos = true;
  }

  cifrar() {
    // Transforma el texto claro en pesos
    const numLetrasPorBloque: number =
      +this.claveForm.get('numLetrasPorBloque')?.value!;

    const textoFragmentado: string[] = this.cifradoForm
      .get('textoClaroInput')
      ?.value.split('');

    console.log(textoFragmentado);

    // Calcular el cifrado para peso
    // Concatenar los pesos cifrados
    // mostrar los pesos cifrados en pantalla

    const generadorG: number = +this.claveForm.get('generadorG')?.value!;
    const primoP: number = +this.claveForm.get('primoP')?.value!;
    const aleatorioX: number = +this.cifradoForm.get('aleatorioX')?.value!;
    const numeroK: number = +this.claveForm.get('numeroK')?.value!;
    const mensaje: number = +this.cifradoForm.get('textoClaroInput')?.value!;

    const numeroY = this.calculoExponenteModulo(generadorG, aleatorioX, primoP);
    const numeroR = this.calculoExponenteModulo(numeroY, numeroK, primoP);
    const numeroS = (mensaje * numeroR) % primoP;

    console.log('generadorG: ', generadorG);
    console.log('aleatorioX: ', aleatorioX);
    console.log('primoP', primoP);
    console.log('numeroY', numeroY);
    console.log('numeroR', numeroR);
    console.log('numeroS', numeroS);
  }

  descifrar() {}

  calculoExponenteModulo(
    base: number,
    exponente: number,
    modulo: number
  ): number {
    if (modulo === 1) {
      return 0;
    }
    let resultado = 1;
    for (let i = 0; i < exponente; i++) {
      resultado = (resultado * base) % modulo;
    }
    return resultado;
  }

  esPrimoRelativo(numeroEntrada: number, phiPrimo: number): boolean {
    for (let i = 2; i < numeroEntrada; i++) {
      if (numeroEntrada % i === 0 && phiPrimo % i === 0) {
        this.notificacionError(
          `${numeroEntrada} no es primo relativo de Phi(p)`
        );
        return false;
      }
    }
    return true;
  }

  esGenerador(generador: number, primo: number): boolean {
    let exponente = 1;
    let resultadoOperacion = this.calculoExponenteModulo(
      generador,
      exponente,
      primo
    );

    while (resultadoOperacion > 1) {
      exponente++;
      resultadoOperacion = this.calculoExponenteModulo(
        generador,
        exponente,
        primo
      );
    }

    if (exponente == primo - 1) {
      return true;
    } else {
      this.notificacionError(
        `${generador} no es un generador para el grupo Z${primo}`
      );
      return false;
    }
  }

  esPrimo(numero: number): boolean {
    if (numero === 2 || numero === 3) {
      return true;
    }

    if (numero <= 1 || numero % 2 == 0 || numero % 3 == 0) {
      this.notificacionError(`${numero} no es un número primo`);
      return false;
    }

    for (let i = 5; i * i < numero; i += 6) {
      if (numero % i == 0 || numero % (i + 2) == 0) {
        this.notificacionError(`${numero} no es un número primo`);
        return false;
      }
    }

    return true;
  }

  notificacionError(mensaje: string): void {
    this.alertCtrl
      .create({
        header: '¡Error!',
        message: mensaje,
        buttons: ['Okay'],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }
}
