/**
 * Adds a simple language widget. jQuery required.
 *
 * @author  kurtextem <kurtextrem@gmail.com>
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package EasyLangWidget
 * @version 0.1
 */

/* register ELW namespace */
var ELW = {};

(function($){
	"use strict";
	
	ELW = function(settings) {
		this.init(settings);
	};
	
	ELW.prototype = {
		_settings: {
			cache: true,
			default_lang: localStorage['elw_lang'] || 'en',
			auto_detect: true,
			translate_on_call: true,
			language_file: 'lang/#.json',
			languages: [
			'de', 'en', 'fr', 'tr', 'pl', 'gr', 'ru'
			],
			append_to: 'body',
			html: ''
		},

		init: function(settings) {
			$.extend(this._settings, settings);
			this._regHashChange();
			
			if(this._settings.auto_detect)
				this._settings.default_lang = navigator.language || navigator.browserLanguage;
			this._addToCache('elw_lang', this._settings.default_lang);
			if(this._settings.translate_on_call) {
				this.translate(this._settings.default_lang);
				this.addWidget();
			}
		},

		translate: function(language) {
			this._settings.default_lang = language;
			this._addToCache('elw_lang', language);
			if(sessionStorage[language] != undefined) {
				this._translateHelper($.parseJSON(sessionStorage[language]));
			}else{
				var _this = this;
				$.ajax({
					url: this._settings.language_file.replace('#', language),
					cache: this._settings.cache,
					success: function(data) {
						_this._translateHelper(data);
						if(_this._settings.cache)
							_this._addToCache(data.language[0], data, 'session');
					},
					error: function() {
						alert('Something went wrong while requesting language file(s).');
					},
				});
			}
		},

		_translateHelper: function(data) {
			$.each(data.language[1], function(id, transl){
				$('.'+id).html(transl);
			});
		},

		/**
		 * Changes the settings.
		 *
		 * @param settings object
		 */
		changeSettings: function(settings) {
			$.extend(this._settings, settings);
		},

		/**
		 * Calls the create widget method.
		 */
		addWidget: function() {
			this._createWidget();
		},

		_createWidget: function() {
			$(this._settings.append_to).append();
		},

		_regHashChange: function() {
			var _this = this;
			window.onhashchange = function(){
				_this._handleHashChange();
			};
			
		},

		_handleHashChange: function() {
			var hash = location.hash;
			if(hash.match(/lang=([A-Z]{1,2})/i) != null){
				var lang = RegExp.$1;
				$('.elw_selected').removeClass('elw_selected').before($('.elw_'+lang));
				$('.elw_'+lang).addClass('elw_selected');
				this.translate(lang);
			}
		},

		/**
		 * Adds an "cache" entry.
		 *
		 * @param name  string
		 * @param data  mixed
		 * @param cache string
		 */
		_addToCache: function(name, data, cache) {
			switch(cache) {
				case 'session':
					sessionStorage.setItem(name, JSON.stringify(data));
					break;
					
				case 'local':
					localStorage.setItem(name, JSON.stringify(data));
					break;

				default:
					localStorage.setItem(name, JSON.stringify(data));
					break;

			}
		},

		/**
		 * Removes an cache entry.
		 *
		 * @param language string
		 */
		removeFromCache: function(language) {
			try{
				sessionStorage.removeItem(language);
			}catch(er){
				console.error(er);
			}
		}
	};

})( jQuery );