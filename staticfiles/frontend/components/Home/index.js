import React from 'react'
import languages from "./lang.js";
<<<<<<< HEAD
import jQuery from 'jquery';
import $ from 'jquery'
import './main.css';
console.log(jQuery.param({'hid':'hi'}));
$(document).ready(function () {
$('body').append('<div>HELLO</div>');
});
import './popper.min.js'
// import './jquery.ui.datepicker-ru.js'
=======
import jQuery from 'jquery'
import './main.css';

import './popper.min.js'
// import './jquery.ui.datepicker-ru.js'
console.log('LOADED 2')
console.log(jQuery)
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b

let lang = languages[document.documentElement.lang];
/**
 * This module only takes care of registering a delivery and products for it in one go.
 * Once all fields are filled, first for is submitted to create a delivery, if successful
 * a second form is submitted to register all products. finally user is alerted of success or failure.
 */
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            example_state: props.example_state,
        }
    }

    componentWillReceiveProps(props) {

    }

    render() {
<<<<<<< HEAD
        return (
            <div>
                <div className="clear-line"></div>
=======
        console.log('RENDERING');
        return (
            <div>
                <div className="clear-line"></div>
                {console.log('hi')}
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
                <div id="logo-block">
                    <div id="logo-image">
                        <center><img id="logo-image-src" src="../logo.png"></img>
                        </center>
                    </div>
                    <div id="logo-center" className="centered-block text-corp-color"/>
                    <div className="centered-block big-block">
                    </div>
                </div>
                <div id="logo-call">
                    <img id="logo-call-src" src="../call-center.png"></img>
                    <div id="logo-email" className="text-corp-color">
                    </div>
                    <div id="logo-call-number">
                        <span className="text-corp-color">+7 7172 690-703, 690-706	</span>
                    </div>
                    <div id="logo-email-bottom">
                        {/*<a href="mailto:opermarket@korem.kz"*/}
                           {/*style="color:#205d6d">opermarket@korem.kz</a>*/}
                        {/*(оператор торгов)*/}
                    </div>
                    <div id="close-image">
                        <a href="https://long.korem.kz/logout">
                            <img id="close-image-src" src=""></img>
                            <div className="text-corp-impact">выход</div>
                        </a>
                    </div>
                </div>
<<<<<<< HEAD
=======
                {console.log('hi2')}
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
                <div>
                    <hr className="corp-line"/>
                </div>

                <div className="clear-line"></div>
                <div
                    className={'background_sp1'}>
                    <div className="big-block centered-block text-black">Организация: Central Asia cement Пользователь:
                        Бужеев Т.Е.
                    </div>
                    <div className="centered-block noprint">
                        <button type="button" onClick={() => window.location.href = '/'}>Данные участника</button>
                        <button type="button" onClick={() => window.location.href = '/trade'}>I сессия</button>
                        <button type="button" onClick={() => window.location.href = '/trade2'}>II сессия</button>
                        <button type="button" onClick={() => window.location.href = '/arhiv'}>Архив</button>
                    </div>
                    <div className="centered-block big-block">
                                <table className="centered-block" id="table-index" cellSpacing="0" cellPadding="2">
                                    <tbody>
                                    <tr>
                                        <td colSpan="2" className="header"><b className="text-black">Данные участника
                                            торгов</b></td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Наименование юридического лица:</td>
                                        <td>АО Central Asia Cement</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Краткое наименование участника:</td>
                                        <td>Central Asia cement</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Почтовый адрес, электронный адрес:
                                        </td>
                                        <td> 101408, , Темиртау, Пос. Актау, , , pdurnev@cac.kz</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Телефон/факс:</td>
                                        <td>8-7213-941-134-1151</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Банковские реквизиты:</td>
                                        <td>Счет № KZ16601037100000304 в АО "Народный Банк Казахстана", Темиртауский
                                            рег.
                                            фил., БИК HSBKKZKX,
                                            БИН 980940003108
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Договор с ОРЦТ:</td>
                                        <td>УЦТ-1-П-688 заключен на период с 25.01.2019 по 31.12.2019</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Руководитель:</td>
                                        <td>Дурнев Петр Владимирович</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="header"><b className="text-black">Статус регистрации
                                            в
                                            торгах</b></td>
                                    </tr>
<<<<<<< HEAD
=======
                                    {console.log('hi3')}
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
                                    <tr>
                                        <td className="table-index-center-border">Регистрация:</td>
                                        <td>зарегистрирован</td>

                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Зона торгов:</td>
                                        <td>северная + южная</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Допуск:</td>
                                        <td>есть</td>

                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Предельный тариф:</td>
                                        <td>.0000</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="header"><b className="text-black">Данные
                                            уполномоченного
                                            лица</b></td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Ф.И.О.:</td>
                                        <td>Бужеев Т.Е.</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Идентификатор:</td>
                                        <td>110841633</td>
                                    </tr>
                                    <tr>
                                        <td className="table-index-center-border">Статус:</td>
                                        <td>Потребитель</td>
                                    </tr>
                                    </tbody>
                                </table>
<<<<<<< HEAD
=======
                            {console.log('hi3')}
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
                    </div>
                </div>
            </div>
        )
    }
}

