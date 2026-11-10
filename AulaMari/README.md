# My Location

## Descrição
My location Base é a base de um app em react native expo para que estudantes possam aprender na prática o uso de persistência de dados e permissões em Apps com React Native expo.

A App possui um botão simulando uma configuração de dark mode e uma lista exibindo as localizações capturadas.

O objetivo do aluno é implementar a camada de persistência de dados e a chamada de permissões.
A informação do Tema Dark deve ser salva usando AsyncStorage.
Os dados de localização devem ser salvos usando SQLite DB.
Para capturar a localização do usuário deverá ser garantido que as permissões de localização sejam fornecidas, usando expo-location.

Exercício de exemplo nas aulas de Solução Mobile do curso de Engenharia de Software e Engenharia da Computação na UniSATC.

## O que foi implementado

* **Dark mode persistido com AsyncStorage** (`@react-native-async-storage/async-storage`): ao alternar o switch, a escolha é salva; ao abrir o app, o tema salvo é carregado.
* **Permissão de localização com expo-location**: ao tocar em "Capturar localização", o app pede a permissão (`requestForegroundPermissionsAsync`) e só captura a posição real (`getCurrentPositionAsync`) se ela for concedida.
* **Lista de localizações persistida com expo-sqlite**: cada localização capturada é inserida na tabela `locations` e aparece na lista; ao abrir o app, as localizações salvas são lidas do banco e exibidas.

## Instalação

1. **Clone o repositório**

    ```bash
   git clone https://github.com/MariMelo1/myLocationBase-master
   cd myLocationBase-master
   npm install
   npx expo start

2. **Rodar o projeto**

    ```bash
   npx expo start

## Objetivos do exercício

* Implementar a persistência da informação do tema dark mode usando Async Storage (react-native-async-storage)
* Implementar a lib expo-location para solicitar as permissões de localização.
* Implementar a persistência da lista de localizações capturadas usando expo-sqlite. Cada nova localização capturada deve ser inserida no banco de dados e exibida na lista (em tela). Ao abrir o App, os dados devem ser recuperados e exibidos em tela.


## Prints de tela

![App light mode](https://lh3.googleusercontent.com/pw/AP1GczPy1gSNUM_8dy9qGMlsN5_P-ef4RLqwsinpTKfGna7CEOR0CIeT4JsIXDptk0usB2BsF4gwk8cFQUvMpJzn27Wc4e0pfDffTUkXc23aCF-MhpukeTYqzOAfUL60407v58IqbZa2F03AKPin2CdpbXPClg=w614-h1328-s-no-gm?authuser=0)
![App dark mode](https://lh3.googleusercontent.com/pw/AP1GczNZg11Nd4spjsQuhjPg9Ldx6TQN3Mttor7kBIbm50aQMcGcksKTuVFjqXraenQmAY-fYYxbLg-kG695SB0Ve0Z9Ga6mGRCxdS0l9u1y0jihcjq1Etq1LnUK8PE4YBWapi8MocEepkkVQ0Z4nUBjAkEXDQ=w614-h1328-s-no-gm?authuser=0) 