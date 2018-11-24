define([
    '/common/hyperscript.js',
    '/common/common-language.js',
    '/customize/messages.js',
    'jquery',
], function (h, Language, Msg, $) {
    var Pages = {};

    Pages.setHTML = function (e, html) {
        e.innerHTML = html;
        return e;
    };

    var languageSelector = function () {
        var options = [];
        var languages = Msg._languages;
        var selected = Msg._languageUsed;
        var keys = Object.keys(languages).sort();
        keys.forEach(function (l) {
            var attr = { value: l };
            if (selected === l) { attr.selected = 'selected'; }
            options.push(h('option', attr, languages[l]));
        });
        var select = h('select', {}, options);
        $(select).change(function () {
            Language.setLanguage($(select).val() || '', null, function () {
                window.location.reload();
            });
        });
        return select;
    };

    var footerCol = function (title, L, literal) {
        return h('div.col-6.col-sm-3', [
            h('ul.list-unstyled', [
                h('li.footer-title', {
                    'data-localization': title,
                }, title? Msg[title]: literal )
                ].concat(L.map(function (l) {
                    return h('li', [ l ]);
                }))
            )
        ]);
    };

    var footLink = function (ref, loc, text) {
        var attrs =  {
            href: ref,
        };
        if (!/^\//.test(ref)) {
            attrs.target = '_blank';
            attrs.rel = 'noopener noreferrer';
        }
        if (loc) {
            attrs['data-localization'] =  loc;
            text = Msg[loc];
        }
        return h('a', attrs, text);
    };

    Pages.infopageFooter = function () {
        return h('footer', [
            h('div.container', [
                h('div.row', [
                    footerCol(null, [
                        h('div.cp-bio-foot', [
                            h('p', Msg.main_footerText),
                            languageSelector()
                        ])
                    ], ''),
                    footerCol('footer_applications', [
                        footLink('/code/', 'main_code'),
                        footLink('/drive/', 'main_drive'),
                        footLink('/poll/', 'main_poll'),
                    ]),
                    footerCol('footer_aboutUs', [
                        footLink('https://piratenpartei.de', null, 'Piratenpartei Deutschland'),
                        footLink('https://blog.cryptpad.fr', null, 'Cryptpad Blog')
                    ]),
                    footerCol('footer_contact', [
                        footLink('https://riot.im/app/#/room/#cryptpad:matrix.org', null, 'Cryptpad Matrix-Chat'),
                        footLink('https://twitter.com/cryptpad', null, 'Cryptpad @ Twitter'),
                        footLink('https://github.com/xwiki-labs/cryptpad', null, 'Code @ GitHub')
                    ])
                ])
            ]),
            h('div.cp-version-footer', "CryptPad v2.12.0 (Manatee)")
        ]);
    };

    Pages.infopageTopbar = function () {
        var rightLinks;
        var username = window.localStorage.getItem('User_name');
        if (username === null) {
            rightLinks = [
                h('a.nav-item.nav-link.cp-login-btn', { href: '/login/'}, Msg.login_login),
                h('a.nav-item.nav-link.cp-register-btn', { href: '/register/'}, Msg.login_register)
            ];
        } else {
            rightLinks = h('a.nav-item.nav-link.cp-user-btn', { href: '/drive/' }, [
                h('i.fa.fa-user-circle'),
                " ",
                username
            ]);
        }

        var button = h('button.navbar-toggler', {
            'type':'button',
            /*'data-toggle':'collapse',
            'data-target':'#menuCollapse',
            'aria-controls': 'menuCollapse',
            'aria-expanded':'false',
            'aria-label':'Toggle navigation'*/
        }, h('i.fa.fa-bars '));

        $(button).click(function () {
            if ($('#menuCollapse').is(':visible')) {
                return void $('#menuCollapse').slideUp();
            }
            $('#menuCollapse').slideDown();
        });

        return h('nav.navbar.navbar-expand-lg',
            h('a.navbar-brand', { href: '/index.html'}),
            button,
            h('div.collapse.navbar-collapse.justify-content-end#menuCollapse', [
                h('a.nav-item.nav-link', { href: 'https://piratenpartei.de'}, 'Piratenpartei Deutschland'),
                h('a.nav-item.nav-link', { href: '/terms.html'}, Msg.terms),
                h('a.nav-item.nav-link', { href: '/about.html'}, Msg.imprint),
                h('a.nav-item.nav-link', { href: '/privacy.html'}, Msg.privacy),
                h('a.nav-item.nav-link', { href: '/faq.html'}, Msg.faq_link)
            ].concat(rightLinks))
        );
    };

    return Pages;
});
