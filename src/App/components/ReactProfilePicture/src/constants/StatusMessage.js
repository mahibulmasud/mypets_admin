import React, { Fragment } from "react";
import Status from "./Status";
import Icon from "../components/Icon/Icon";
import { retrieveLanguage } from "../../../../../utils/user-infos";

const StatusMessage = {
    [Status.EMPTY]: <p className={"fe6xZVPr1kb0CJksW39zV"}>
        <i className="fas fa-plus-circle fa-6x color-gradiant-green" /> <br /><br />
        {
            retrieveLanguage() === 'fr' ? "Déposez votre photo" :
                retrieveLanguage() === 'es' ? "Suelta tu foto" :
                    retrieveLanguage() === 'it' ? "Rilascia la tua foto" :
                        retrieveLanguage() === 'pt' ? "Solte sua foto" :
                            retrieveLanguage() === 'de' ? "Lass dein Foto fallen" : "Drop your photo"
        }
    </p>,
    [Status.LOADING]: <Icon name="loading" size={48} />,
    [Status.DRAGOVER]: (
        <Fragment>
            <Icon name="upload" size={48} />
            <p className={"fe6xZVPr1kb0CJksW39zV"}>
                {
                    retrieveLanguage() === 'fr' ? "Déposez votre photo" :
                        retrieveLanguage() === 'es' ? "Suelta tu foto" :
                            retrieveLanguage() === 'it' ? "Rilascia la tua foto" :
                                retrieveLanguage() === 'pt' ? "Solte sua foto" :
                                    retrieveLanguage() === 'de' ? "Lass dein Foto fallen" : "Drop your photo"
                }
            </p>
        </Fragment>
    ),
    [Status.INVALID_FILE_TYPE]: (
        <Fragment>
            <p className={"fe6xZVPr1kb0CJksW39zV"}><i className="fas fa-plus-circle fa-2x color-gradiant-green" /></p>
            <p className={"fe6xZVPr1kb0CJksW39zV"}>
                {
                    retrieveLanguage() === 'fr' ? "Seules les images sont autorisées." :
                        retrieveLanguage() === 'es' ? "Solo se permiten imágenes." :
                            retrieveLanguage() === 'it' ? "Sono ammesse solo immagini." :
                                retrieveLanguage() === 'pt' ? "Apenas imagens permitidas." :
                                    retrieveLanguage() === 'de' ? "Nur Bilder erlaubt." : "Only images allowed."
                }
            </p>
        </Fragment>
    ),
    [Status.INVALID_IMAGE_SIZE]: (
        <Fragment>
            <p className={"fe6xZVPr1kb0CJksW39zV"}><i className="fas fa-plus-circle fa-2x color-gradiant-green" /></p>
            <p className={"fe6xZVPr1kb0CJksW39zV"}>
                {
                    retrieveLanguage() === 'fr' ? "Votre photo doit mesurer plus de 350 pixels." :
                        retrieveLanguage() === 'es' ? "Tu foto debe tener un tamaño superior a 350 px." :
                            retrieveLanguage() === 'it' ? "La tua foto deve essere più grande di 350 px." :
                                retrieveLanguage() === 'pt' ? "Sua foto deve ter mais de 350 px." :
                                    retrieveLanguage() === 'de' ? "Ihr Foto muss größer als 350 Pixel sein." : "Your photo must be larger than 350px."
                }
            </p>
        </Fragment>
    ),
    [Status.LOADED]: null
};

export default StatusMessage;
