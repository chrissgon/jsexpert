Colaboradores
ID
Nome
Tipo -> PROFESSOR, ALUNO, COORDENADOR

Salas
ID
Nome

Reservas
ID
SalaID
ColaboradorID
Inicio
Fim


RN1 - Só pode reservar salas professores ou coordenadores
RN2 - É preciso reservar as salas com 48 horas de antecedencia
RN3 - Não deve ser permitido duas reservas com mesma sala, data de inicio e final
RN4 - Só é possivel reservar salas por no máximo 14 dias
RN5 - Para reservar é preciso informar a sala, colaborador, data de inicio e final
RN6 - Só é possivel desmarcar uma sala com 24 horas de antecedencia

## Use Case 01

Como um usurio do sistema
De perfil diferente de PROFESSOR ou COORDENADOR
Nao deve permitir criar uma reserva

## Use Case 02

Como um usurio do sistema
De perfil PROFESSOR ou COORDENADOR
Para reservar uma sala
Dada a data atual como 01/01/2023
Deve ser possível selecionar uma data somente entre 03/01/2023 até 14/01/2023
Dentro do horário de funcionamento (8hrs até 18hrs)

## Use Case 03

Como um usurio do sistema
De perfil PROFESSOR ou COORDENADOR
Ao reservar uma sala
Dada que a data escolhida possui reserva
Nao se deve deixar criar outra reserva
