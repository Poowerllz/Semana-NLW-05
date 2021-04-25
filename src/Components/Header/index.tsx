import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

export function Header(){
    // Um jeito de pegar a data utilizando o date FNS
    const currentDate = format(new Date(), "EEEEEE, d MMMM" ,{
        locale: ptBR,
    });
        
    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Imagem com a logo do Podcastr"/>
            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}