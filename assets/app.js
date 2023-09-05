document.addEventListener('DOMContentLoaded', function () {
    cookieconsent.run({"notice_banner_type":"simple","consent_type":"express","palette":"dark","language":"de","page_load_consent_levels":["strictly-necessary"],"notice_banner_reject_button_hide":false,"preferences_center_close_button_hide":false,"website_name":"Gutscheine"});
    });
    
let ga = document.querySelector('script[cookie-consent="tracking"]');
ga.remove(); 

let url = new URL(window.location.href);

let path_parts = url.pathname.split('/');

let main = document.querySelector('.main');
main.classList.remove('order-2');
main.classList.add('order-1');
main.classList.add('order-md-2');

let side = document.querySelector('.side');
side.classList.remove('order-1');
side.classList.add('order-2');
side.classList.add('order-md-1');

if(path_parts.length > 2){
    let store = path_parts[2].replace('.html', '');

    fetch('https://www.meingutscheincode.eu/misc/api', {
        method: 'POST',
        body: JSON.stringify({store_name: store})
    })
    .then(result => {
        return result.json();
    }).then(data => {

        let head =  document.querySelector('head');
        let canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.protocol + "//" + window.location.host + window.location.pathname;
        head.appendChild(canonical);

        let meta_title = document.querySelector('title');
        meta_title.innerText = data.store.meta.title; 

        let meta_description = document.querySelector('meta[name="description"]');
        meta_description.content = data.store.meta.description; 

        let meta_keywords = document.querySelector('meta[name="keywords"]');
        meta_keywords.content = data.store.meta.keywords; 
        
        let store_image = document.querySelector('.merchant-logo');
        store_image.src = data.store.store_image; 

        let rating = document.querySelector('.merchant-rating');
        rating.innerHTML = data.store.rating; 

        let h1 = document.querySelector('.merchant-title');
        h1.innerHTML = data.store.h1;

        let short_desc = document.querySelector('.merchant-short_desc');
        short_desc.innerHTML = data.store.short_desc;

        let navigation = document.querySelector('.navigation');
        navigation.innerHTML = data.breadcrumbs;

        let voucher_container = document.querySelector('.vouchers-active');
        voucher_container.setAttribute('id', 'active-voucher');
        voucher_container.innerHTML = data.vouchers.html;

        let filter = document.querySelector('.widget-voucher_stats .widget-inner');
        filter.innerHTML = data.store.filter;

        let related_stores = document.querySelector('.widget-related_vouchers .widget-inner');
        related_stores.innerHTML = data.store.related_stores;

        let long_desc = document.querySelector('.merchant-long_desc');
        long_desc.innerHTML = data.store.long_desc;

        let promoted_stores = document.querySelector('.merchant-promoted_stores');
        promoted_stores.innerHTML = data.store.promoted_stores;

        let footer_links = document.querySelector('.footer-links');
        footer_links.innerHTML = data.footer.links;

        let footer_disclaimer = document.querySelector('.footer-disclaimer');
        footer_disclaimer.innerHTML = data.footer.disclaimer;
    })
}

$('body').on('click', '[data-go-url]', function() {
    window.open($(this).data('go-url'), '_blank');
});
$('body').on('click', '[data-out-url]', function() {
    var u = window.location.protocol + "//" + window.location.host + window.location.pathname + '#v' + $(this).data('id');
    window.open(u, '_blank');
    window.location.href = $(this).data('out-url');
});

$('body').on('click', 'li.list-group-item:not(:first):not(.original-voucher), #ob-modal div.list-group-item', function() {

    $('#ob-modal').hide();
    var p = $(this).data('provider-id'),
        d = $(this).data('direct-url'),
        i = $(this).data('id');
    if (d !== undefined) {
        window.open($(this).data('direct-url'));
    } else if (p !== undefined) {
        var stores = {
            8: 'http://www.cupoworld.de',
            18: 'http://www.stargutschein.org',
            29: 'https://www.alltagz.org',
            46: 'https://www.coupoworld.com',
            47: 'https://www.stargutscheine.com',
            48: 'https://spartda.de',
            49: 'https://webmasterplan.com',
        };
        var slug = stores[p] + '/gutscheine/' + $(this).data('provider-url') + '/#v' + i;

        window.open(slug);
        window.location.href = 'https://www.meingutscheincode.eu/jump/' + p + '/' + i + '/?utm_source=gthmgc' + i, '_blank', '';
    } else {
        window.open('https://www.meingutscheincode.eu/jump/' + i + '/?utm_source=gthmgc' + i, '_blank', '');
    }
});