-- Schema logico:
-- Utente(ID, email, firstname, lastname, pass)
-- Post(ID, idUtente, oraPubblicazione)
-- Liked(idUtente, idPost)
-- Seguiti(idUtente, idUtenteSeguito)
-- CartellaSalvati(ID, idUtente)
-- Salvati(idCartella, idPost)

-- Implementazione SQL:
create table Utente(
    ID int not null auto_increment,
    email varchar(255) not null unique,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    pass varchar(255) not null,
    profilePicture varchar(255) not null default 'default_pp.png',
    username varchar(255) not null default 'username',
    rememberMe varchar(255),
    expireTime int default 0,
    primary key(ID)
);

create table Post(
    ID int not null auto_increment,
    idUtente int not null,
    oraPubblicazione timestamp not null DEFAULT CURRENT_TIMESTAMP,
    urlImmagine varchar(255) not null,
    altDescription varchar(255) not null,
    primary key(ID),
    foreign key(idUtente) references Utente(ID) ON DELETE CASCADE
);

create table Liked(
    idUtente int not null,
    idPost int not null,
    primary key(idUtente, idPost),
    foreign key(idUtente) references Utente(ID),
    foreign key(idPost) references Post(ID) ON DELETE CASCADE
);

create table Seguiti(
    idUtente int not null,
    idUtenteSeguito int not null,
    primary key(idUtente, idUtenteSeguito),
    foreign key(idUtente) references Utente(ID),
    foreign key(idUtenteSeguito) references Utente(ID) ON DELETE CASCADE,
    CONSTRAINT no_autofollow CHECK (idUtente != idUtenteSeguito)
);

create table CartellaSalvati(
    ID int not null auto_increment,
    idUtente int not null,
    primary key(ID),
    foreign key(idUtente) references Utente(ID) ON DELETE CASCADE
);

create table Salvati(
    idCartella int not null,
    idPost int not null,
    primary key(idCartella, idPost),
    foreign key(idCartella) references CartellaSalvati(ID) ON DELETE CASCADE,
    foreign key(idPost) references Post(ID) ON DELETE CASCADE
);
