/*
* @class ManterLista
*********************************/
(function(document) {
	//localStorage.clear();

	var input = document.getElementsByName('lista-tarefas')[0].getElementsByTagName('input'),
		qtdade = 0;

	/*
	* Verifica e aplica os novos estilos de 
	* acordo com o estado do input checkbox
	*
	* @method adicionaItem
	* @param  {object} // elementos DOM
	*********************************/
	var adicionaItem = function(data) {
		input = document.getElementsByName('lista-tarefas')[0].getElementsByTagName('input');
		qtdade = 0;

		var novo = document.getElementById("container-tarefa").getElementsByTagName('li')[0].cloneNode(true);
		novo = document.getElementsByName('lista-tarefas')[0].getElementsByTagName('ul')[0].appendChild(novo);


			// identifica item raiz
    		novo.getElementsByTagName("input")[0].setAttribute('id', input[input.length-1].className + "-" + (input.length-1));

    		// insere item fake
    		var newLabel = document.createElement("label");
    		var label = input[input.length-1].parentNode.appendChild(newLabel);

    		// aponta para item raiz
    		label.setAttribute('for', input[input.length-1].className + "-" + (input.length-1));



	    	input[0].checked = false;
			input[0].removeAttribute("checked");

		editarItem(novo.getElementsByTagName("a")[0]);

		addEvento(novo, {
	    	'_event'			: "change",
	    	'callback'			: verificaCheck,
	    	'wantsUntrusted'	: true
	    });

		addEvento(novo.getElementsByTagName('div')[2], {
	    	'_event'			: "click",
	    	'callback'			: removeItem,
	    	'wantsUntrusted'	: true
	    });

		for (var i = 0; i < input.length; i++) {
			if(i !== 0) {
		    	verificaCheck({
		    		'target'		: input[i],
		    		'srcElement'	: {
		    			'checked'	: input[i].checked
		    		}
		    	});
		    	continue;
		    }
	    }

	    // atualiza filtros no rodape
		new atualizaFiltros(input,qtdade);
	},

	/*
	* Verifica e aplica os novos estilos de
	* acordo com o estado do input checkbox
	*
	* @method verificaCheck
	* @param  {object} // elementos DOM
	*********************************/
	verificaCheck = function(data) {
		if(data) {
			var _a = data.target.parentNode.parentNode.getElementsByTagName('a')[0];

			data.srcElement = data.srcElement?data.srcElement:data.target;

			if(data.srcElement.checked) {
				_a.style.textDecoration = "line-through";
				_a.style.color = "rgb(169,169,176)";
			} else {
				_a.style.textDecoration = "none";
				_a.style.color = "rgb(77,77,77)";
			}
		}

		qtdade = 0;

		for (var i = 0; i < input.length; i++) {
	        if (input[i].type === 'checkbox') {
	           	if(input[i].checked) {
	  				input[i].setAttribute("checked","checked");
	            } else {
	            	input[0].removeAttribute("checked");
	            	input[i].removeAttribute("checked");
	            }
				
	        	if(i !== 0) {
	        		if(input[i].checked) {
	            		qtdade++;
	            		continue;
	            	}
	        	}
	        } 
	    }

	    new atualizaFiltros(input,qtdade);
	},

	/*
	* Desmarca todos inputs do tipo checkbox 
	*
	* @method resetaCheck
	* @param  {object} // elementos DOM
	*********************************/
	resetaCheck = function(data) {
		qtdade = 0;

		for (var i = 0; i < input.length; i++) {
			input[i].checked = false;
			input[i].removeAttribute("checked");

			if(i !== 0) {
		    	verificaCheck({
		    		'target'	: input[i],
		    		'srcElement': {'checked':input[i].checked}
		    	});
		    	continue;
		    }
	    }

	    new atualizaFiltros(input,qtdade);
	},

	/*
	* Remove todas tarefas completas 
	*
	* @method removeCompletos
	* @param  {object} // elementos DOM
	*********************************/
	removeCompletos = function(data) {
		input = document.getElementsByName('lista-tarefas')[0].getElementsByTagName('input');
		qtdade = 0;

		for (var i = 0; i < input.length; i++) {
			if(input[i].checked && i !== 0) {
				input[i].parentNode.parentNode.parentNode.removeChild(input[i].parentNode.parentNode);
				i = 0;
				continue;
			}
	    }

	    if(input.length <= 1) {
	    	input[0].checked = false;
			input[0].removeAttribute("checked");
	    }

	    // atualiza filtros no rodape
	    new atualizaFiltros(input,qtdade);
	},

	/*
	* Marca todas tarefas
	*
	* @method todosCheck
	* @param  {object} // elementos DOM
	*********************************/
	todosCheck = function(data) {
		qtdade = 0;

		for (var i = 0; i < input.length; i++) {
			data.srcElement = data.srcElement?data.srcElement:data.target;
			data.srcElement.checked?input[i].checked = true:input[i].checked = false;
			
			if(i !== 0) {
		    	verificaCheck({
		    		'target'		: input[i],
		    		'srcElement'	: {
		    			'checked'	: input[i].checked
		    		}
		    	});
		    	continue;
		    }
	    }

	    // atualiza filtros no rodape
	    new atualizaFiltros(input,qtdade);
	},

	/*
	* Remove item da lista de tarefas
	*
	* @method removeItem
	* @param  {object} // elementos DOM
	*********************************/
	removeItem = function(data) {				
		data.target.parentNode.parentNode.removeChild(data.target.parentNode);
		
		for (var i = 0; i < input.length; i++) {
			if(i !== 0) {
		    	verificaCheck({
		    		'target':input[i],
		    		'srcElement':{'checked':input[i].checked}
		    	});
		    	continue;
		    }
	    }

	    // atualiza filtros no rodape
		new atualizaFiltros(input,qtdade);
	},

	/*
	* Atualiza filtro rodape com a 
	* situação atual dos itens da lista 
	*
	* @method atualizaFiltros
	* @param  {object} // elementos DOM
	*********************************/
	atualizaFiltros = function(obj, num) {
		// INSERE QUQNATIDADE DE ITENS NAO CONCLUIDOS
		document.getElementById("itens-completos").textContent = num;
		document.getElementById("itens-left").textContent = obj.length - 1 - num;
	},

	/*
	* Edita item da lista de tarefas
	*
	* @method editarItem
	* @param  {object} // elemento DOM
	*********************************/
	editarItem = function(data) {
		if(data) {
			// desabilita edicao
		    addEvento(data, {
		    	'_event'	: "blur",
		    	'callback'	: function () { 
					data.setAttribute("contenteditable","false");
					data.style.outline = '1px solid transparent';
		    	},
		    	'wantsUntrusted'	: true
		    });

			// habilita edicao
		    addEvento(data, {
		    	'_event'	: "dblclick",
		    	'callback'	: function () {
					data.setAttribute("contenteditable","true");
					data.style.outline = '1px solid rgb(154,138,131)';
					data.focus();
		    	},
		    	'wantsUntrusted'	: true
		    });
		}
	},

	/*
	* Adiciona evento com compatibilidade
	* crossbrowser
	*
	* @method addEvento
	* @param  {object} // elemento DOM
	* @param  {object} // param de configuracao
	*********************************/
	addEvento = function(data, args) {
		if(data && args) {
			if (data.addEventListener) {
				data.addEventListener(args._event, args.callback, args.wantsUntrusted);
			} else if (data.attachEvent)  {
				switch(args._event) {
					case 'click': args._event = 'onclick';
					break;
					case 'blur': args._event = 'onblur';
					break;
					case 'dblclick':args._event = 'ondblclick';
					break;
					case 'change':args._event = 'onchange';
					break;
				}
				data.attachEvent(args._event, args.callback);
			}
		}
	};

	if(localStorage) {
		if(localStorage.getItem('dados')) {
	    	document.getElementsByName('lista-tarefas')[0].innerHTML = localStorage.getItem('dados');
		}
	}

	var _a = document.getElementsByTagName("a");
	for (var i = 0; i < _a.length; i++) {
		if(_a[i].hasAttribute("contenteditable")) {
			editarItem(_a[i]);
		}
    }

	// atualiza filtros no rodape
	new atualizaFiltros(input,qtdade);

	for (var i = 0; i < input.length; i++) {
        if (input[i].type === 'checkbox' && i !== 0) {
	    	verificaCheck({
	    		'target':input[i],
	    		'srcElement':{'checked':input[i].checked}
	    	});

            addEvento(input[i], {
		    	'_event'			: "change",
		    	'callback'			: verificaCheck,
		    	'wantsUntrusted'	: true
		    });
		    continue;
        }
    }

    // mantem estado alterado
    addEvento(document, {
    	'_event'			: "DOMSubtreeModified",
    	'callback'			: function() {
    								if(localStorage) {
										localStorage.setItem('dados', document.getElementsByName('lista-tarefas')[0].innerHTML);
									}
								},
    	'wantsUntrusted'	: false
    });

    // adiciona novo item
    addEvento(document.getElementById('adicionar'), {
    	'_event'			: "click",
    	'callback'			: adicionaItem,
    	'wantsUntrusted'	: true
    });

    // remove todos concluidos
    addEvento(document.getElementById('remove-completos'), {
    	'_event'			: "click",
    	'callback'			: removeCompletos,
    	'wantsUntrusted'	: true
    });

    // marca todos
    addEvento(document.getElementsByName('marcar-todos')[0], {
    	'_event'			: "change",
    	'callback'			: todosCheck,
    	'wantsUntrusted'	: true
    });

    // desmarca todos
    addEvento(document.getElementById('reseta-itens'), {
    	'_event'			: "click",
    	'callback'			: resetaCheck,
    	'wantsUntrusted'	: true
    });

    // remove item
    var li = document.getElementsByName('lista-tarefas')[0].getElementsByTagName('li');
    for(var i = 0; i < li.length; i++) {
    	if(i !== 0) {
    		addEvento(li[i].getElementsByTagName('div')[2], {
		    	'_event'			: "click",
		    	'callback'			: removeItem,
		    	'wantsUntrusted'	: true
		    });
		    continue;
    	}
    }
})(document);

/*
* @class HTML5 Fixes
*********************************/
(function(document) {
	var input = document.getElementsByName('lista-tarefas')[0].getElementsByTagName("input");

	// percorre todos itens customizados
	for(var id = 0; id < input.length; id++) {
		if(input[id].getAttribute('type') === "checkbox") {
			// identifica item raiz
    		input[id].setAttribute('id', input[id].className + "-" + id);

    		// insere item fake
    		var newLabel = document.createElement("label");
    		var label = input[id].parentNode.appendChild(newLabel);

    		// aponta para item raiz
    		label.setAttribute('for', input[id].className + "-" + id);
    	}
	};
})(document);