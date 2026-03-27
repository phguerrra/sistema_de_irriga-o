# Sistema de Irrigação Automático 🌱💧

## Sobre o Projeto
O Sistema de Irrigação Automático é um projeto desenvolvido com o objetivo de automatizar a irrigação de plantas utilizando sensores de umidade do solo. O sistema monitora a umidade do solo em tempo real e ativa automaticamente a irrigação quando o nível de umidade está abaixo do ideal.

Este projeto foi desenvolvido como parte de estudos e aplicação de conceitos de automação, programação e Internet das Coisas (IoT).

---

## Objetivo
O objetivo do projeto é criar um sistema automatizado capaz de:
- Monitorar a umidade do solo
- Acionar automaticamente a irrigação
- Evitar desperdício de água
- Facilitar o cuidado com plantas
- Automatizar o processo de irrigação

---

## Funcionamento do Sistema
O sistema funciona da seguinte forma:

1. O sensor de umidade do solo realiza a leitura da umidade.
2. O microcontrolador (Arduino/ESP) recebe os dados do sensor.
3. O sistema verifica se a umidade está abaixo do valor definido.
4. Se a umidade estiver baixa, o sistema aciona a bomba de água.
5. Quando a umidade atingir o nível ideal, a irrigação é desligada.

---

## Componentes Utilizados

- Arduino ou ESP32
- Sensor de umidade do solo
- Módulo relé
- Bomba de água
- Fonte de alimentação
- Jumpers
- Mangueira de água

---

## Tecnologias Utilizadas

| Tecnologia | Função |
|------------|-------|
| Arduino / ESP32 | Controle do sistema |
| Sensor de Umidade | Medição da umidade do solo |
| Relé | Acionamento da bomba |
| Linguagem C/C++ | Programação |
| IoT | Automação do sistema |

---

## Estrutura do Projeto

sistemaIrragacao/
│
├── src/
├── include/
├── lib/
├── test/
├── platformio.ini
└── README.md



---

## Como Executar o Projeto

1. Instalar o Arduino IDE ou PlatformIO
2. Conectar o Arduino/ESP32 ao computador
3. Abrir o projeto
4. Fazer o upload do código para a placa
5. Conectar o sensor de umidade e o relé
6. Ligar o sistema

---

## Aplicações
Este sistema pode ser utilizado em:
- Hortas
- Jardins
- Estufas
- Plantações
- Projetos de automação residencial
- Agricultura inteligente

---

## Autor
Pedro Guerra  
Curso de Ciência da Computação  
Projeto de Automação – Sistema de Irrigação

---

## Licença
Este projeto é de caráter acadêmico.
