# FacturandoNoMas — Especificación de funcionalidades para migración a web

> Documento de extracción de funcionalidades de la aplicación de escritorio
> **FacturandoNoMas** (Windows Forms, .NET Framework 4.7.2, C#) para su
> posterior reimplementación como sitio web.
>
> **IMPORTANTE:** El diseño de las facturas debe ser **exactamente igual** al
> actual. Las plantillas HTML (sección 5) están copiadas de forma textual
> (verbatim) y son la fuente de verdad para el aspecto visual.

---

## 1. Visión general

Aplicación de escritorio para **generar facturas en HTML** de un servicio de
taxi. El usuario rellena un formulario, la app calcula importes, rellena una
plantilla HTML con placeholders y abre el resultado (`salida.html`) en el
navegador para imprimirlo.

### Stack original

- Windows Forms / C# / .NET Framework 4.7.2.
- Sin base de datos real: persistencia en **archivos de texto plano** junto al
  ejecutable.
- Plantillas HTML con **Bootstrap 4.5.2 + jQuery 3.5.1 + Popper.js 1.16.1** por
  CDN.
- Configuración regional: **español** (números con coma decimal).

### Flujo de trabajo

1. La app arranca mostrando un **menú** con dos opciones.
2. El usuario elige el tipo de factura:
   - **Factura General** → `FormularioPrincipal`
   - **Factura Educación** → `FormularioFacturaEducacion`
3. Rellena datos, la app calcula en vivo base / IVA / total.
4. Pulsa **"Generar Factura"**:
   - Lee la plantilla HTML correspondiente desde disco.
   - Sustituye los placeholders `{{...}}`.
   - Escribe el resultado en `salida.html`.
   - Lo abre en el navegador por defecto.

### Datos fijos del emisor (aparecen en ambas plantillas)

| Campo | Valor |
|-------|-------|
| Nombre | Jose Antonio Burdaspar Casado |
| Web | https://taxiperalta.com |
| Dirección | Avda. La Paz nº 74, 31350 Peralta (Navarra) |
| Teléfonos | 948750185 - 619461076 |
| Email | taxi1peralta@gmail.com |
| NIF | 15809048-K |
| Cuenta bancaria | Caja Rural ES9730080028873445439825 |
| Logo | `./Resources/favicon.png` |
| Footer | `taxiperalta.com` |

---

## 2. Menú principal

Formulario `Menu`. Contiene únicamente dos botones:

| Botón | Texto | Acción |
|-------|-------|--------|
| `btnFacturaGeneral` | **Factura General** | Abre `FormularioPrincipal` |
| `btnFacturaEducacion` | **Factura Educación** | Abre `FormularioFacturaEducacion` |

---

## 3. Factura General

Formulario `FormularioPrincipal` (título de ventana: "Facturando No Mas").
Compuesto por tres grupos y una tabla.

### 3.1 Grupo "Empresa o Entidad"

| Campo | Control | Descripción |
|-------|---------|-------------|
| Nombre | `tbNombreEntidad` | Autocompletado con entidades guardadas. Al escribir un nombre existente rellena automáticamente dirección y código. |
| Dirección | `tbDireccionEntidad` | Texto libre |
| Código | `tbCodigo` | Texto libre |
| — | `btnGuardarEntidad` | Botón **"Guardar Entidad"** |

**Comportamiento "Guardar Entidad":**
- Valida que no estén vacíos Nombre, Dirección y Código (si los tres vacíos → alerta).
- Añade la entidad a la lista persistida.
- Actualiza el autocompletado de nombres.
- Limpia los tres campos.

### 3.2 Grupo "General"

| Campo | Control | Descripción |
|-------|---------|-------------|
| Km recorrido (Día) | `num_kmDia` | NumericUpDown, 2 decimales |
| Km recorrido (Noche) | `num_kmNoche` | NumericUpDown, 2 decimales |
| Hora espera (Día) | `num_horaDia` | NumericUpDown, 2 decimales |
| Hora espera (Noche) | `num_horaNoche` | NumericUpDown, 2 decimales |
| — | `btnGuardarTarifas` | Botón **"Guardar Tarifas"** |
| Número factura | `tbNumeroFactura` | Texto |
| Fecha factura | `dateTimePicker1` | Fecha |
| Mostrar kilometros en la factura | `cbMostrarKilometros` | Checkbox |
| Mostrar horas en la factura | `cbMostrarHoras` | Checkbox |
| — | `btnGenerarFactura` | Botón **"Generar Factura"** (verde) |

Las 4 tarifas se cargan al abrir desde `config.txt` (4 líneas, ver sección 7) y
se guardan al cerrar la app o al pulsar "Guardar Tarifas".

### 3.3 Grupo "Linea de la factura"

| Campo | Control | Descripción |
|-------|---------|-------------|
| Fecha | `dtpFechaLinea` | Fecha de la línea |
| Descripción | `tbDescripcionLinea` | Texto |
| Origen | `tbOrigenLinea` | Texto |
| Destino | `tbDestinoLinea` | Texto |
| Kilometros | `num_KmLinea` | Entero (máx 10000) |
| Horas | `num_HorasLinea` | Decimal 1 posición (máx 10000) |
| Tarifa a aplicar | `rbDiurna` / `rbNocturna` | RadioButton (Diurna marcado por defecto) |
| — | `btnAnadirLinea` | Botón **"Añadir linea"** |

### 3.4 Tabla de líneas (`dataGridView1`)

Columnas (auto-generadas desde la clase `DatosFactura`):

| # | Columna | Tipo |
|---|---------|------|
| 0 | Fecha | string |
| 1 | Descripcion | string |
| 2 | Origen | string |
| 3 | Destino | string |
| 4 | Tarifa | enum (Diurna / Nocturna) — **read-only** |
| 5 | Kilometros | int |
| 6 | Horas | decimal |
| 7 | Importe | decimal |

- Click derecho sobre una fila → menú contextual **"Eliminar"** (elimina la fila
  y recalcula totales).
- Al editar una celda se recalculan todos los importes y totales.

### 3.5 Totales (parte inferior)

Tres campos de solo lectura:

- **BASE** (`tbBase`)
- **IVA 10%** (`tbIva`)
- **TOTAL** (`tbTotal`)

### 3.6 Modelo de datos

Clase `DatosFactura`:

```csharp
public enum TipoTarifa { Diurna, Nocturna }

public string Fecha { get; set; }
public string Descripcion { get; set; }
public string Origen { get; set; }
public string Destino { get; set; }
public TipoTarifa Tarifa { get; set; }
public int Kilometros { get; set; }
public decimal Horas { get; set; }
public decimal Importe { get; set; }
```

Clase `Entidad`:

```csharp
public string Nombre { get; set; }
public string Direccion { get; set; }
public string Codigo { get; set; }
```

### 3.7 Reglas de negocio y cálculos

**Al añadir una línea (`btnAnadirLinea_Click`):**

1. Validación: se añade solo si hay algún dato (Descripción, Origen, Destino no
   vacíos, o Km > 0, o Horas > 0). Si todo vacío → alerta
   "No puedes añadir una línea de la factura en blanco...".
2. Selección de tarifa según radio:
   - **Diurna**: `precio_km = config[0]`, `precio_h = config[2]`
   - **Nocturna**: `precio_km = config[1]`, `precio_h = config[3]`
3. `importe = km × precio_km + horas × precio_h`
4. Se acumula `importeSin += importe`.
5. Se actualizan:
   - `BASE = importeSin`
   - `IVA = 0.10 × importeSin`
   - `TOTAL = importeSin + IVA`

**Al editar una fila (`dataGridView1_CellValueChanged`):**

- Recalcula desde cero: para cada línea `guita = precio_km × km + precio_h × horas`
  usando la tarifa **seleccionada actualmente en los radios** (no la guardada por
  línea). Actualiza `Importe` de cada fila y vuelve a calcular totales.

**Al eliminar una fila (`eliminarFila_Click`):**

- Pide confirmación ("¿Estas seguro de que quieres eliminar esta línea...?").
- Resta el importe de esa línea y recalcula totales.

> Nota de redondeo: los importes no se redondean de forma explícita en la
> factura general (se usa el valor decimal tal cual).

### 3.8 Validaciones al generar la factura

`btnGenerarFactura_Click` valida en este orden:

1. Si no hay líneas → alerta "No se puede generar la factura, no exite lineas...".
2. Si Nombre, Dirección y Código están los tres vacíos → alerta "...no exite datos de la empresa o entidad".
3. Si Número de factura vacío → alerta "...no exite el número de la factura".

### 3.9 Lógica de generación HTML (Factura General)

1. Lee el contenido de `plantilla.html`.
2. **Columnas condicionales** usando el marcador `{{VER_KILOMTEROS}}`:
   - Si `cbMostrarKilometros` marcado → elimina los marcadores (une todo).
   - Si no → elimina el bloque entre los marcadores, ocultando la columna de
     kilómetros.
   - Análogo con `{{VER_HORAS}}` y `cbMostrarHoras`.
3. Sustituye placeholders de cabecera/totales/tarifas:
   `{{NOMBRE}}`, `{{DIRECCION}}`, `{{CODIGO}}`, `{{PRECIO_SIN}}`, `{{IVA}}`,
   `{{PRECIO_CON}}`, `{{KMDIA}}`, `{{KMNOCHE}}`, `{{HORADIA}}`, `{{HORANOCHE}}`,
   `{{NUMERO_FACTURA}}`, `{{FECHA}}`, `{{COLSPAN}}`.
4. **Filas repetidas** usando el marcador `{{FILA}}`: clona el fragmento entre
   `{{FILA}}` y `{{FILA}}` una vez por línea, sustituyendo `{{NUMERO_F}}`,
   `{{FECHA_F}}`, `{{DESCRIPCION_F}}`, `{{ORIGEN_F}}`, `{{DESTINO_F}}`,
   `{{TARIFA_F}}`, `{{KILOMETROS_F}}`, `{{HORAS_F}}`, `{{IMPORTE_F}}`.
5. Escribe `salida.html` y lo abre en el navegador.

Detalle de la lógica condicional original (split sobre marcador):

```
html = html.Split("{{VER_KILOMTEROS}}")
si mostrarKilometros: html = join(trozos)  // deja todas las partes
si no:               html = trozos[0] + trozos[2] + trozos[4]  // elimina columna
```

---

## 4. Factura Educación

Formulario `FormularioFacturaEducacion` (título de ventana:
"Factura Para Educación").

### 4.1 Campos

Grupo **"General"**:

| Campo | Control | Descripción |
|-------|---------|-------------|
| Número de factura | `tbNumeroFactura` | Texto |
| Fecha factura | `dtpFechaFactura` | Fecha |
| Código de asignación | `tbCodigoAsignacion` | Texto, con autocompletado |

Resto del formulario:

| Campo | Control | Descripción |
|-------|---------|-------------|
| Trayecto | `tbTrayecto` | Texto, con autocompletado |
| Coste Diario | `num_CosteDiario` | NumericUpDown, 2 decimales, valor por defecto **59,99** |
| Dias | `num_Dias` | Entero (máx 100000) |
| Mes | `cbMes` | ComboBox desplegable con los 12 meses en español |
| — | `btnGenerarFactura` | Botón **"Generar factura"** |

Meses disponibles (en orden): Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio,
Agosto, Septiembre, Octubre, Noviembre, Diciembre.

Totales (editables en este formulario, recalcula total):

- **BASE** (`tbBase`)
- **IVA 10%** (`tbIva`)
- **TOTAL** (`tbTotal`)

### 4.2 Destinatario fijo

En esta plantilla el destinatario es fijo (no se rellena desde el formulario):

```
DEPARTAMENTO DE EDUCACIÓN
SERVICIO DE INFRAESTRUCTURAS EDUCATIVAS
NEGOCIADO DE SERVICIOS COMPLEMENTARIOS
31001 Cuesta de Santo Domingo, Pamplona
N.I.F. S-3100007-H
```

Y en los detalles: **Número de expediente: 514TEE** (fijo).

### 4.3 Reglas de negocio y cálculos

**Cálculo de importe (`actualizarImporte`):**

- Solo si `días > 0` y `costeDiario > 0`.
- `importe = días × costeDiario`, redondeado a 2 decimales (`Math.Round`).
- `IVA = 0.10 × importe`, redondeado a 2 decimales.
- `TOTAL = importe + IVA`.

Se recalcula al cambiar `num_Dias` o `num_CosteDiario`.

**Actualización del total (`actualizarTotal`):**

- Si `tbBase` o `tbIva` cambian (editables por el usuario), `TOTAL = BASE + IVA`.

### 4.4 Validaciones al generar la factura

1. Número de factura vacío → "Falta de introducir el número de la factura".
2. Trayecto vacío → "Falta de introducir el trayecto de la factura".
3. Días ≤ 0 → "El número de días tiene que ser mayor que cero".
4. Coste diario ≤ 0 → "El coste diario tiene que ser mayor que cero".
5. Mes vacío → "Falta de introducir el mes de la factura".

### 4.5 Lógica de generación HTML (Factura Educación)

1. Al generar, **añade** el trayecto actual a la lista de autocompletado de
   trayectos y el código de asignación a su lista.
2. Lee `PlantillaEducacion.html`.
3. Sustituye placeholders: `{{NUMERO_FACTURA}}`, `{{FECHA}}`,
   `{{CODIGO_ASIGNACION}}`, `{{MES_F}}`, `{{TRAYECTO_F}}`, `{{COSTEDIARIO_F}}`,
   `{{DIAS_F}}`, `{{IMPORTE_F}}`, `{{PRECIO_SIN}}`, `{{IVA}}`, `{{PRECIO_CON}}`.
4. Escribe `salida.html` y lo abre en el navegador.

---

## 5. Plantillas HTML (copiadas textualmente)

Estas plantillas son la **fuente de verdad del diseño**. El sitio web debe
reproducir este diseño exactamente.

### 5.1 `plantilla.html` (Factura General)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Factura</title>
    <!-- CSS only -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

    <!-- JS, Popper.js, and jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
    <style>
        #invoice {
            padding: 30px;
        }

        .invoice {
            position: relative;
            background-color: #FFF;
            min-height: 680px;
            padding: 15px
        }

            .invoice header {
                padding: 10px 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #3989c6
            }

            .invoice .company-details {
                text-align: right
            }

                .invoice .company-details .name {
                    margin-top: 0;
                    margin-bottom: 0
                }

            .invoice .contacts {
                margin-bottom: 20px
            }

            .invoice .invoice-to {
                text-align: left
            }

                .invoice .invoice-to .to {
                    margin-top: 0;
                    margin-bottom: 0
                }

            .invoice .invoice-details {
                text-align: right
            }

                .invoice .invoice-details .invoice-id {
                    margin-top: 0;
                    color: #3989c6
                }

            .invoice main {
                padding-bottom: 50px
            }

                .invoice main .thanks {
                    margin-top: -100px;
                    font-size: 2em;
                    margin-bottom: 50px
                }

                .invoice main .notices {
                    padding-left: 6px;
                    border-left: 6px solid #3989c6
                }

                    .invoice main .notices .notice {
                        font-size: 1em
                    }

            .invoice table {
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                margin-bottom: 20px
            }

                .invoice table td, .invoice table th {
                    padding: 15px;
                    background: #eee;
                    border-bottom: 1px solid #fff
                }

                .invoice table th {
                    white-space: nowrap;
                    font-weight: 400;
                    font-size: 16px
                }

                .invoice table td h3 {
                    margin: 0;
                    font-weight: 400;
                    color: #3989c6;
                    font-size: 1.2em
                }

                .invoice table .qty, .invoice table .total, .invoice table .unit {
                    text-align: right;
                    font-size: 1.2em
                }

                .invoice table .no {
                    color: #fff;
                    font-size: 1.6em;
                    background: #3989c6
                }

                .invoice table .unit {
                    background: #ddd
                }

                .invoice table .total {
                    background: #3989c6;
                    color: #fff
                }

                .invoice table tbody tr:last-child td {
                    border: none
                }

                .invoice table tfoot td {
                    background: 0 0;
                    border-bottom: none;
                    white-space: nowrap;
                    text-align: right;
                    padding: 10px 20px;
                    font-size: 1.2em;
                    border-top: 1px solid #aaa
                }

                .invoice table tfoot tr:first-child td {
                    border-top: none
                }

                .invoice table tfoot tr:last-child td {
                    color: #3989c6;
                    font-size: 1.4em;
                    border-top: 1px solid #3989c6
                }

                .invoice table tfoot tr td:first-child {
                    border: none
                }

            .invoice footer {
                width: 100%;
                text-align: center;
                color: #777;
                border-top: 1px solid #aaa;
                padding: 8px 0
            }

        @media print {
            .invoice {
                font-size: 11px !important;
                overflow: hidden !important
            }

                .invoice footer {
                    position: absolute;
                    bottom: 10px;
                    page-break-after: always
                }

                .invoice > div:last-child {
                    page-break-before: always
                }
        }
    </style>
</head>
<body>
    <div id="invoice">
        <div class="invoice overflow-auto">
            <div style="min-width: 600px">
                <header>
                    <div class="row">
                        <div class="col">
                            <a target="_blank" href="https://taxiperalta.com">
                                <img src="./Resources/favicon.png" data-holder-rendered="true" />
                            </a>
                        </div>
                        <div class="col company-details">
                            <h2 class="name">
                                <a target="_blank" href="https://taxiperalta.com">
                                    Jose Antonio Burdaspar Casado
                                </a>
                            </h2>
                            <div>Avda. La Paz nº 74, 31350 Peralta (Navarra)</div>
                            <div>948750185 - 619461076</div>
                            <div>taxi1peralta@gmail.com</div>
                            <div>NIF 15809048-K</div>
                            <div>Caja Rural ES9730080028873445439825</div>
                        </div>
                    </div>
                </header>
                <main>
                    <div class="row contacts">
                        <div class="col invoice-to">
                            <h2 class="to">{{NOMBRE}}</h2>
                            <div class="address">{{DIRECCION}}</div>
                            <div class="email">{{CODIGO}}</div>
                        </div>
                        <div class="col invoice-details">
                            <h2 class="invoice-id">Número: {{NUMERO_FACTURA}}</h2>
                            <div class="date">Fecha: {{FECHA}}</div>
                        </div>
                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th class="text-left">FECHA</th>
                                <th class="text-left">DESCRIPCIÓN</th>
                                <th class="text-left">ORIGEN</th>
                                <th class="text-left">DESTINO</th>
                                <th class="text-left">TARIFA</th>
                                {{VER_KILOMTEROS}}
                                <th class="text-right">KILOMETROS</th>
                                {{VER_KILOMTEROS}}
                                {{VER_HORAS}}
                                <th class="text-right">HORAS</th>
                                {{VER_HORAS}}
                                <th class="text-right">IMPORTE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{FILA}}
                            <tr>
                                <td class="no">{{NUMERO_F}}</td>
                                <td class="text-left">{{FECHA_F}}</td>
                                <td class="text-left">{{DESCRIPCION_F}}</td>
                                <td class="text-left">{{ORIGEN_F}}</td>
                                <td class="text-left">{{DESTINO_F}}</td>
                                <td class="text-left">{{TARIFA_F}}</td>
                                {{VER_KILOMTEROS}}
                                <td class="qty">{{KILOMETROS_F}}</td>
                                {{VER_KILOMTEROS}}
                                {{VER_HORAS}}
                                <td class="qty">{{HORAS_F}}</td>
                                {{VER_HORAS}}
                                <td class="total">{{IMPORTE_F}}€</td>
                            </tr>
                            {{FILA}}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="{{COLSPAN}}"></td>
                                <td colspan="2">BASE</td>
                                <td>{{PRECIO_SIN}}</td>
                            </tr>
                            <tr>
                                <td colspan="{{COLSPAN}}"></td>
                                <td colspan="2">IVA 10%</td>
                                <td>{{IVA}}</td>
                            </tr>
                            <tr>
                                <td colspan="{{COLSPAN}}"></td>
                                <td colspan="2">TOTAL</td>
                                <td>{{PRECIO_CON}}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="notices">
                        <div style="font-weight: bold">TARIFAS:</div>
                        <div class="notice">Diurna: {{KMDIA}}€ kilometro recorrido / {{HORADIA}}€ hora de espera</div>
                        <div class="notice">Nocturna: {{KMNOCHE}}€ kilometro recorrido / {{HORANOCHE}}€ hora de espera</div>
                    </div>
                </main>
                <footer>
                    taxiperalta.com
                </footer>
            </div>
            <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom-->
            <div></div>
        </div>
    </div>
</body>
</html>
```

### 5.2 `PlantillaEducacion.html` (Factura Educación)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Factura</title>
    <!-- CSS only -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

    <!-- JS, Popper.js, and jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
    <style>
        #invoice {
            padding: 30px;
        }

        .invoice {
            position: relative;
            background-color: #FFF;
            min-height: 680px;
            padding: 15px
        }

            .invoice header {
                padding: 10px 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #3989c6
            }

            .invoice .company-details {
                text-align: right
            }

                .invoice .company-details .name {
                    margin-top: 0;
                    margin-bottom: 0
                }

            .invoice .contacts {
                margin-bottom: 20px
            }

            .invoice .invoice-to {
                text-align: left
            }

                .invoice .invoice-to .to {
                    margin-top: 0;
                    margin-bottom: 0
                }

            .invoice .invoice-details {
                text-align: right
            }

                .invoice .invoice-details .invoice-id {
                    margin-top: 0;
                    color: #3989c6
                }

            .invoice main {
                padding-bottom: 50px
            }

                .invoice main .thanks {
                    margin-top: -100px;
                    font-size: 2em;
                    margin-bottom: 50px
                }

                .invoice main .notices {
                    padding-left: 6px;
                    border-left: 6px solid #3989c6
                }

                    .invoice main .notices .notice {
                        font-size: 1em
                    }

            .invoice table {
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                margin-bottom: 20px
            }

                .invoice table td, .invoice table th {
                    padding: 15px;
                    background: #eee;
                    border-bottom: 1px solid #fff
                }

                .invoice table th {
                    white-space: nowrap;
                    font-weight: 400;
                    font-size: 16px
                }

                .invoice table td h3 {
                    margin: 0;
                    font-weight: 400;
                    color: #3989c6;
                    font-size: 1.2em
                }

                .invoice table .qty, .invoice table .total, .invoice table .unit {
                    text-align: right;
                    font-size: 1.2em
                }

                .invoice table .no {
                    color: #fff;
                    font-size: 1.6em;
                    background: #3989c6
                }

                .invoice table .unit {
                    background: #ddd
                }

                .invoice table .total {
                    background: #3989c6;
                    color: #fff
                }

                .invoice table tbody tr:last-child td {
                    border: none
                }

                .invoice table tfoot td {
                    background: 0 0;
                    border-bottom: none;
                    white-space: nowrap;
                    text-align: right;
                    padding: 10px 20px;
                    font-size: 1.2em;
                    border-top: 1px solid #aaa
                }

                .invoice table tfoot tr:first-child td {
                    border-top: none
                }

                .invoice table tfoot tr:last-child td {
                    color: #3989c6;
                    font-size: 1.4em;
                    border-top: 1px solid #3989c6
                }

                .invoice table tfoot tr td:first-child {
                    border: none
                }

            .invoice footer {
                width: 100%;
                text-align: center;
                color: #777;
                border-top: 1px solid #aaa;
                padding: 8px 0
            }

        @media print {
            .invoice {
                font-size: 11px !important;
                overflow: hidden !important
            }

                .invoice footer {
                    position: absolute;
                    bottom: 10px;
                    page-break-after: always
                }

                .invoice > div:last-child {
                    page-break-before: always
                }
        }
    </style>
</head>
<body>
    <div id="invoice">
        <div class="invoice overflow-auto">
            <div style="min-width: 600px">
                <header>
                    <div class="row">
                        <div class="col">
                            <a target="_blank" href="https://taxiperalta.com">
                                <img src="./Resources/favicon.png" data-holder-rendered="true" />
                            </a>
                        </div>
                        <div class="col company-details">
                            <h2 class="name">
                                <a target="_blank" href="https://taxiperalta.com">
                                    Jose Antonio Burdaspar Casado
                                </a>
                            </h2>
                            <div>Avda. La Paz nº 74, 31350 Peralta (Navarra)</div>
                            <div>948750185 - 619461076</div>
                            <div>taxi1peralta@gmail.com</div>
                            <div>NIF 15809048-K</div>
                            <div>Caja Rural ES9730080028873445439825</div>
                        </div>
                    </div>
                </header>
                <main>
                    <div class="row contacts">
                        <div class="col invoice-to">
                            <h2 class="to">DEPARTAMENTO DE EDUCACIÓN</h2>
                            <div class="address" style="font-weight: bold">SERVICIO DE INFRAESTRUCTURAS EDUCATIVAS</div>
                            <div class="address" style="font-weight: bold">NEGOCIADO DE SERVICIOS COMPLEMENTARIOS</div>
                            <div class="address">31001 Cuesta de Santo Domingo, Pamplona</div>
                            <div class="email">N.I.F. S-3100007-H</div>
                        </div>
                        <div class="col invoice-details">
                            <h2 class="invoice-id">Número: {{NUMERO_FACTURA}}</h2>
                            <div class="date">Fecha: {{FECHA}}</div>
                            <div class="address h6" style="font-weight: bold">Código de asignación: {{CODIGO_ASIGNACION}}</div>
                            <div class="address h6" style="font-weight: bold">Número de expediente: 514TEE</div>
                        </div>
                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th class="text-left">MES</th>
                                <th class="text-left">TRAYECTO</th>
                                <th class="text-right">COSTE DIARIO</th>
                                <th class="text-right">DIAS</th>
                                <th class="text-right">IMPORTE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="no">1</td>
                                <td class="text-left">{{MES_F}}</td>
                                <td class="text-left">{{TRAYECTO_F}}</td>
                                <td class="text-right">{{COSTEDIARIO_F}}</td>
                                <td class="text-right">{{DIAS_F}}</td>
                                <td class="text-right">{{IMPORTE_F}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"></td>
                                <td colspan="2">BASE</td>
                                <td>{{PRECIO_SIN}}</td>
                            </tr>
                            <tr>
                                <td colspan="3"></td>
                                <td colspan="2">IVA 10%</td>
                                <td>{{IVA}}</td>
                            </tr>
                            <tr>
                                <td colspan="3"></td>
                                <td colspan="2">TOTAL</td>
                                <td>{{PRECIO_CON}}</td>
                            </tr>
                        </tfoot>
                    </table>
                </main>
                <footer>
                    taxiperalta.com
                </footer>
            </div>
            <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom-->
            <div></div>
        </div>
    </div>
</body>
</html>
```

---

## 6. Referencia de placeholders

### 6.1 `plantilla.html` (Factura General)

| Placeholder | Fuente |
|-------------|--------|
| `{{NOMBRE}}` | `tbNombreEntidad.Text` |
| `{{DIRECCION}}` | `tbDireccionEntidad.Text` |
| `{{CODIGO}}` | `tbCodigo.Text` |
| `{{PRECIO_SIN}}` | `tbBase.Text` (ya incluye `€`) |
| `{{IVA}}` | `tbIva.Text` (ya incluye `€`) |
| `{{PRECIO_CON}}` | `tbTotal.Text` (ya incluye `€`) |
| `{{KMDIA}}` | `config[0]` (km diurna) |
| `{{KMNOCHE}}` | `config[1]` (km nocturna) |
| `{{HORADIA}}` | `config[2]` (hora diurna) |
| `{{HORANOCHE}}` | `config[3]` (hora nocturna) |
| `{{NUMERO_FACTURA}}` | `tbNumeroFactura.Text` |
| `{{FECHA}}` | `dateTimePicker1.Value` (fecha corta) |
| `{{COLSPAN}}` | Nº de columnas vacías del `tfoot` (4 + columnas visibles) |
| `{{VER_KILOMTEROS}}` | Marcador condicional columna kilómetros |
| `{{VER_HORAS}}` | Marcador condicional columna horas |
| `{{FILA}}` | Marcador de fila repetida (por línea) |
| `{{NUMERO_F}}` | Índice (1, 2, 3...) |
| `{{FECHA_F}}` | `linea.Fecha` |
| `{{DESCRIPCION_F}}` | `linea.Descripcion` |
| `{{ORIGEN_F}}` | `linea.Origen` |
| `{{DESTINO_F}}` | `linea.Destino` |
| `{{TARIFA_F}}` | `linea.Tarifa` (Diurna / Nocturna) |
| `{{KILOMETROS_F}}` | `linea.Kilometros` |
| `{{HORAS_F}}` | `linea.Horas` |
| `{{IMPORTE_F}}` | `linea.Importe` |

### 6.2 `PlantillaEducacion.html` (Factura Educación)

| Placeholder | Fuente |
|-------------|--------|
| `{{NUMERO_FACTURA}}` | `tbNumeroFactura.Text` |
| `{{FECHA}}` | `dtpFechaFactura.Value` (fecha corta) |
| `{{CODIGO_ASIGNACION}}` | `tbCodigoAsignacion.Text` |
| `{{MES_F}}` | `cbMes.Text` |
| `{{TRAYECTO_F}}` | `tbTrayecto.Text` |
| `{{COSTEDIARIO_F}}` | `num_CosteDiario.Value` |
| `{{DIAS_F}}` | `num_Dias.Value` |
| `{{IMPORTE_F}}` | `tbBase.Text` |
| `{{PRECIO_SIN}}` | `tbBase.Text` |
| `{{IVA}}` | `tbIva.Text` |
| `{{PRECIO_CON}}` | `tbTotal.Text` |

---

## 7. Formato de archivos de datos

Todos en texto plano, ubicados junto al ejecutable (raíz de la app).

### `config.txt` — tarifas (4 líneas, separador decimal coma)

```
0,61      <- Km recorrido Diurna
0,76      <- Km recorrido Nocturna
16,86     <- Hora de espera Diurna
21,08     <- Hora de espera Nocturna
```

### `Entidades.txt` — entidades guardadas (3 líneas por entidad)

```
<Nombre>
<Direccion>
<Codigo>
<Nombre>
<Direccion>
<Codigo>
...
```

### `TrayectosEduacion.txt` — historial de trayectos (1 por línea)

> Nota: el nombre real del fichero tiene un typo (`Eduacion` en vez de `Educacion`).

### `CodiigosAsignacion.txt` — historial de códigos de asignación (1 por línea)

> Nota: el nombre real del fichero tiene un typo (`Codiigos` en vez de `Codigos`).

---

## 8. Notas y peculiaridades a tener en cuenta

1. **Separador decimal coma**: los valores numéricos se guardan/formatean con
   coma (es-ES). En web habrá que decidir si se normaliza a punto o se mantiene
   coma según locale.

2. **El símbolo `€` en totales**: en la Factura General, `tbBase`, `tbIva` y
   `tbTotal` incluyen el sufijo `€` (`importeSin.ToString() + "€"`), por lo que
   los placeholders `{{PRECIO_SIN}}`, `{{IVA}}`, `{{PRECIO_CON}}` ya llevan el
   símbolo. Sin embargo el importe de cada fila se muestra con `€` **en la
   plantilla** (`{{IMPORTE_F}}€`).

3. **Typos en nombres de fichero**: `TrayectosEduacion.txt` y
   `CodiigosAsignacion.txt`. A mantener o corregir según conveniencia.

4. **Recálculo de tarifa por fila**: al editar cualquier celda de la tabla, los
   importes se recalculan usando la tarifa seleccionada **en los radios en ese
   momento**, no la tarifa almacenada por línea.

5. **Columna Tarifa read-only**: la columna índice 4 (Tarifa) de la tabla no es
   editable directamente; se fija al añadir la línea mediante los radios.

6. **Coste diario por defecto**: 59,99 € en la Factura Educación.

7. **IVAs**: 10 % en ambos tipos de factura.

8. **`@media print`**: las plantillas tienen reglas de impresión (fuente 11px,
   footer fijo abajo, salto de página). El sitio web debe preservarlas para que
   la factura impresa sea idéntica.

9. **El `div` final vacío** (`<!--DO NOT DELETE THIS div...-->`) es funcional:
   mantiene el footer al final de la página. No debe eliminarse.

10. **Formato de fecha**: se usa `ToShortDateString()` (fecha corta según
    cultura). Ej. `dd/MM/yyyy` en es-ES.

11. **Sin base de datos**: toda la persistencia es por archivos de texto. En la
    migración web se recomienda una base de datos (SQLite/PostgreSQL/etc.), pero
    manteniendo la misma semántica de autocompletado y guardado.

12. **Dependencias por CDN**: Bootstrap 4.5.2, jQuery 3.5.1 y Popper 1.16.1 se
    cargan por CDN en las plantillas. En web se pueden reemplazar por versiones
    locales o mantener el CDN.

13. **`salida.html`** es siempre el nombre del archivo generado y se abre en el
    navegador; no se mantiene historial de facturas en la app original.
