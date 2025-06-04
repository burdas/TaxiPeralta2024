"use client";

import {useState, useEffect} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {showDangerToast, showOkToast} from "@/utils/Toast.ts";

export default function TarifasForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [tarifas, setTarifas] = useState({
        diurna: {
            kmRecorrido: 0,
            horaEspera: 0,
            minimoPercepcion: 0
        },
        nocturna: {
            kmRecorrido: 0,
            horaEspera: 0,
            minimoPercepcion: 0
        }
    });

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await fetch('/api/tarifas');
                if (!response.ok) {
                    throw new Error('Error al cargar las tarifas');
                }
                const data = await response.json();
                setTarifas(data);
            } catch (error) {
                console.error('Error:', error);
                showDangerToast('Error al cargar las tarifas');
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        };

        fetchTarifas();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const [tipo, campo] = name.split('.');

        setTarifas(prev => ({
            ...prev,
            [tipo]: {
                ...prev[tipo as keyof typeof prev],
                [campo]: value ? parseFloat(value) : ''
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/tarifas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarifas)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar las tarifas');
            }

            showOkToast('Tarifas guardadas correctamente');
        } catch (error) {
            console.error('Error al guardar las tarifas:', error);
            showDangerToast('Error al guardar las tarifas');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mt-16">
            <h2 className="text-2xl font-bold my-6">Configuración de Tarifas</h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-8">
                    {/* Tarifa Diurna */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            <CardTitle className="text-xl font-semibold">Tarifa Diurna</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="diurna.kmRecorrido" className="text-lg">Precio por kilómetro</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="diurna.kmRecorrido"
                                        name="diurna.kmRecorrido"
                                        type="number"
                                        value={tarifas.diurna.kmRecorrido}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        defaultValue="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diurna.horaEspera" className="text-lg">Hora de espera</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="diurna.horaEspera"
                                        name="diurna.horaEspera"
                                        type="number"
                                        value={tarifas.diurna.horaEspera}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diurna.minimoPercepcion" className="text-lg">Mínimo a percibir</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="diurna.minimoPercepcion"
                                        name="diurna.minimoPercepcion"
                                        type="number"
                                        value={tarifas.diurna.minimoPercepcion}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarifa Nocturna */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            <CardTitle className="text-xl font-semibold" >Tarifa Nocturna</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nocturna.kmRecorrido" className="text-lg">Precio por kilómetro</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="nocturna.kmRecorrido"
                                        name="nocturna.kmRecorrido"
                                        type="number"
                                        value={tarifas.nocturna.kmRecorrido}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nocturna.horaEspera" className="text-lg">Hora de espera</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="nocturna.horaEspera"
                                        name="nocturna.horaEspera"
                                        type="number"
                                        value={tarifas.nocturna.horaEspera}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nocturna.minimoPercepcion" className="text-lg">Mínimo a percibir</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                                    <Input
                                        id="nocturna.minimoPercepcion"
                                        name="nocturna.minimoPercepcion"
                                        type="number"
                                        value={tarifas.nocturna.minimoPercepcion}
                                        onChange={handleChange}
                                        className="pl-8 dark:scheme-light-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col items-end">
                    <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 min-w-40"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
