-- Schema logico:
-- Utente(ID, email, firstname, lastname, pass)
-- Post(ID, idUtente, oraPubblicazione)
-- Liked(idUtente, idPost)
-- Seguiti(idUtente, idUtenteSeguito)
-- CartellaSalvati(ID, idUtente)
-- Salvati(idCartella, idPost)

-- Implementazione SQL:
create table utente(
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

create table post(
    ID int not null auto_increment,
    idUtente int not null,
    oraPubblicazione timestamp not null DEFAULT CURRENT_TIMESTAMP,
    urlImmagine varchar(255) not null,
    altDescription varchar(255) not null,
    primary key(ID),
    foreign key(idUtente) references utente(ID) ON DELETE CASCADE
);

create table liked(
    idUtente int not null,
    idPost int not null,
    primary key(idUtente, idPost),
    foreign key(idUtente) references utente(ID),
    foreign key(idPost) references post(ID) ON DELETE CASCADE
);

create table seguiti(
    idUtente int not null,
    idUtenteSeguito int not null,
    primary key(idUtente, idUtenteSeguito),
    foreign key(idUtente) references utente(ID),
    foreign key(idUtenteSeguito) references utente(ID) ON DELETE CASCADE,
    CONSTRAINT no_autofollow CHECK (idUtente != idUtenteSeguito)
);

create table cartellaSalvati(
    ID int not null auto_increment,
    idUtente int not null,
    primary key(ID),
    foreign key(idUtente) references utente(ID) ON DELETE CASCADE
);

create table salvati(
    idCartella int not null,
    idPost int not null,
    primary key(idCartella, idPost),
    foreign key(idCartella) references cartellaSalvati(ID) ON DELETE CASCADE,
    foreign key(idPost) references post(ID) ON DELETE CASCADE
);
