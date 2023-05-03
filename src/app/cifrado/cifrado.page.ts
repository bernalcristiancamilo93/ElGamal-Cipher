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
    primoP: new FormControl('', Validators.required),
    generadorG: new FormControl('', Validators.required),
    numeroK: new FormControl('', Validators.required),
    numLetrasPorBloque: new FormControl(2, Validators.required),
  });

  public cifradoForm: FormGroup = new FormGroup({
    textoClaroInput: new FormControl('', Validators.required),
    aleatorioX: new FormControl('', Validators.required),
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

  // Alfabeto
  private alfabeto: string[] = [
    ' ',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

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
    const numLetrasPorBloque: number =
      +this.claveForm.get('numLetrasPorBloque')?.value!;

    // Quita los acentos, signos de puntuación y pasa todo a mayúsculas y
    // separa el mensaje en caracteres individuales.
    const textoFragmentado: string[] = this.cifradoForm
      .get('textoClaroInput')
      ?.value.toUpperCase()
      // .replace(/\s/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!¡¿?]/g, '')
      .split('');

    // Asigna peso a cada caracter
    const mensajeConPesos: number[] = [];

    for (const letra of textoFragmentado) {
      mensajeConPesos.push(this.asignarPeso(letra));
    }

    // Verifica los pesos y forma un nuevo array
    const primoP: number = +this.claveForm.get('primoP')?.value!;

    const textoFormateado: string[] = [];
    const pesosConcatenados: number[] = [];

    for (let i = 0; i < textoFragmentado.length; i++) {
      let valorConcatenado: number | string = '';
      valorConcatenado += mensajeConPesos[i];
      valorConcatenado += mensajeConPesos[i + 1];
      valorConcatenado = +valorConcatenado;

      if (valorConcatenado < primoP) {
        textoFormateado.push(textoFragmentado[i] + textoFragmentado[i + 1]);
        pesosConcatenados.push(valorConcatenado);
        i++;
      } else {
        textoFormateado.push(`  ` + textoFragmentado[i]);
        pesosConcatenados.push(mensajeConPesos[i]);
      }
    }

    // Hace el cifrado para cada peso
    const generadorG: number = +this.claveForm.get('generadorG')?.value!;
    const aleatorioX: number = +this.cifradoForm.get('aleatorioX')?.value!;
    const numeroK: number = +this.claveForm.get('numeroK')?.value!;

    const numeroY = this.calculoExponenteModulo(generadorG, aleatorioX, primoP);
    const numeroR = this.calculoExponenteModulo(numeroY, numeroK, primoP);
    const pesosCifrados: number[][] = [];

    for (const peso of pesosConcatenados) {
      pesosCifrados.push(this.cifrarPeso(peso, numeroR, primoP));
    }

    // Muestra en pantalla el texto formateado y los pesos correspondientes
    this.cifradoForm.get('textoClaroFormateado')?.patchValue(textoFormateado);
    this.cifradoForm
      .get('pesosTextoClaroFormateado')
      ?.patchValue(pesosConcatenados);

    let pesosCifradosFormateado: string = '';

    for (const peso of pesosCifrados) {
      pesosCifradosFormateado += `(${peso[0]}, ${peso[1]});`;
    }

    pesosCifradosFormateado = pesosCifradosFormateado.substring(
      0,
      pesosCifradosFormateado.length - 1
    );

    this.cifradoForm
      .get('pesosCifradosOutput')
      ?.patchValue(pesosCifradosFormateado);

    // Logs de consola
    // console.log('textoFragmentado', textoFragmentado);
    // console.log('mensajeConPesos', mensajeConPesos);
    // console.log('textoFormateado', textoFormateado);
    // console.log('pesosConcatenados', pesosConcatenados);
  }

  cifrarPeso(peso: number, numeroR: number, primoP: number): number[] {
    const numeroS = (peso * numeroR) % primoP;

    // Logs de consola
    // console.log('generadorG: ', generadorG);
    // console.log('aleatorioX: ', aleatorioX);
    // console.log('primoP', primoP);
    // console.log('numeroY', numeroY);
    // console.log('numeroR', numeroR);
    // console.log('numeroS', numeroS);

    return [numeroR, numeroS];
  }

  descifrar() {
    const textoCifradoCrudo: string[] = this.descifradoForm
      .get('textoCifradoInput')
      ?.value.split(';');

    const parejasPesosCifrados: number[][] = [];

    for (const pareja of textoCifradoCrudo) {
      parejasPesosCifrados.push(
        pareja
          .replace(/[()]/g, '')
          .split(',')
          .map((array) => +array)
      );
    }

    // Cálculo de clave r inversa
    const primoP: number = +this.claveForm.get('primoP')?.value!;
    const numeroR: number = parejasPesosCifrados[0][0];

    let rIversa = 0;
    for (let i = 1; i < primoP; i++) {
      if ((i * primoP + 1) % numeroR === 0) {
        rIversa = (i * primoP + 1) / numeroR;
        break;
      }
    }

    // Descrifado de cada mensaje
    const pesosDescifados: number[] = [];
    for (const pareja of parejasPesosCifrados) {
      pesosDescifados.push((pareja[1] * rIversa) % primoP);
    }

    this.descifradoForm.get('textoClaroOutput')?.patchValue(pesosDescifados);
  }

  asignarPeso(letra: string): number {
    return this.alfabeto.findIndex((caracter) => caracter === letra);
  }

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
