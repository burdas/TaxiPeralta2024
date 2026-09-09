export const plantillaEducacion = `<!DOCTYPE html>
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
                    padding: 8px 6px;
                    background: #eee;
                    border-bottom: 1px solid #fff;
                    overflow-wrap: break-word
                }

                .invoice table th {
                    font-weight: 400;
                    font-size: 13px
                }

                .invoice table td h3 {
                    margin: 0;
                    font-weight: 400;
                    color: #3989c6;
                    font-size: 1.2em
                }

                .invoice table .qty, .invoice table .total, .invoice table .unit {
                    text-align: right;
                    font-size: 1em
                }

                .invoice table .no {
                    color: #fff;
                    font-size: 1.2em;
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
`;
