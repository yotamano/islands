/*!
 * jQuery Drum Control - v0.1.2 - 2020-04-14
 * https://github.com/tigrr/drum
 * Copyright (c) Tigran Sargsyan
 * Licensed MIT
 */

/*! jQuery UI - v1.12.1 - 2019-06-30
 * http://jqueryui.com
 * Includes: widget.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */
!(function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery);
})(function (h) {
    (h.ui = h.ui || {}), (h.ui.version = "1.12.1");
    var n,
        i = 0,
        a = Array.prototype.slice;
    (h.cleanData =
        ((n = h.cleanData),
        function (t) {
            var e, i, s;
            for (s = 0; null != (i = t[s]); s++)
                try {
                    (e = h._data(i, "events")) && e.remove && h(i).triggerHandler("remove");
                } catch (t) {}
            n(t);
        })),
        (h.widget = function (t, i, e) {
            var s,
                n,
                o,
                r = {},
                a = t.split(".")[0],
                u = a + "-" + (t = t.split(".")[1]);
            return (
                e || ((e = i), (i = h.Widget)),
                h.isArray(e) && (e = h.extend.apply(null, [{}].concat(e))),
                (h.expr[":"][u.toLowerCase()] = function (t) {
                    return !!h.data(t, u);
                }),
                (h[a] = h[a] || {}),
                (s = h[a][t]),
                (n = h[a][t] = function (t, e) {
                    return this._createWidget ? void (arguments.length && this._createWidget(t, e)) : new n(t, e);
                }),
                h.extend(n, s, { version: e.version, _proto: h.extend({}, e), _childConstructors: [] }),
                ((o = new i()).options = h.widget.extend({}, o.options)),
                h.each(e, function (e, s) {
                    return h.isFunction(s)
                        ? void (r[e] = function () {
                              var t,
                                  e = this._super,
                                  i = this._superApply;
                              return (this._super = n), (this._superApply = o), (t = s.apply(this, arguments)), (this._super = e), (this._superApply = i), t;
                          })
                        : void (r[e] = s);
                    function n() {
                        return i.prototype[e].apply(this, arguments);
                    }
                    function o(t) {
                        return i.prototype[e].apply(this, t);
                    }
                }),
                (n.prototype = h.widget.extend(o, { widgetEventPrefix: (s && o.widgetEventPrefix) || t }, r, { constructor: n, namespace: a, widgetName: t, widgetFullName: u })),
                s
                    ? (h.each(s._childConstructors, function (t, e) {
                          var i = e.prototype;
                          h.widget(i.namespace + "." + i.widgetName, n, e._proto);
                      }),
                      delete s._childConstructors)
                    : i._childConstructors.push(n),
                h.widget.bridge(t, n),
                n
            );
        }),
        (h.widget.extend = function (t) {
            for (var e, i, s = a.call(arguments, 1), n = 0, o = s.length; n < o; n++)
                for (e in s[n]) (i = s[n][e]), s[n].hasOwnProperty(e) && void 0 !== i && (t[e] = h.isPlainObject(i) ? (h.isPlainObject(t[e]) ? h.widget.extend({}, t[e], i) : h.widget.extend({}, i)) : i);
            return t;
        }),
        (h.widget.bridge = function (o, e) {
            var r = e.prototype.widgetFullName || o;
            h.fn[o] = function (i) {
                var t = "string" == typeof i,
                    s = a.call(arguments, 1),
                    n = this;
                return (
                    t
                        ? this.length || "instance" !== i
                            ? this.each(function () {
                                  var t,
                                      e = h.data(this, r);
                                  return "instance" === i
                                      ? ((n = e), !1)
                                      : e
                                      ? h.isFunction(e[i]) && "_" !== i.charAt(0)
                                          ? (t = e[i].apply(e, s)) !== e && void 0 !== t
                                              ? ((n = t && t.jquery ? n.pushStack(t.get()) : t), !1)
                                              : void 0
                                          : h.error("no such method '" + i + "' for " + o + " widget instance")
                                      : h.error("cannot call methods on " + o + " prior to initialization; attempted to call method '" + i + "'");
                              })
                            : (n = void 0)
                        : (s.length && (i = h.widget.extend.apply(null, [i].concat(s))),
                          this.each(function () {
                              var t = h.data(this, r);
                              t ? (t.option(i || {}), t._init && t._init()) : h.data(this, r, new e(i, this));
                          })),
                    n
                );
            };
        }),
        (h.Widget = function () {}),
        (h.Widget._childConstructors = []),
        (h.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: { classes: {}, disabled: !1, create: null },
            _createWidget: function (t, e) {
                (e = h(e || this.defaultElement || this)[0]),
                    (this.element = h(e)),
                    (this.uuid = i++),
                    (this.eventNamespace = "." + this.widgetName + this.uuid),
                    (this.bindings = h()),
                    (this.hoverable = h()),
                    (this.focusable = h()),
                    (this.classesElementLookup = {}),
                    e !== this &&
                        (h.data(e, this.widgetFullName, this),
                        this._on(!0, this.element, {
                            remove: function (t) {
                                t.target === e && this.destroy();
                            },
                        }),
                        (this.document = h(e.style ? e.ownerDocument : e.document || e)),
                        (this.window = h(this.document[0].defaultView || this.document[0].parentWindow))),
                    (this.options = h.widget.extend({}, this.options, this._getCreateOptions(), t)),
                    this._create(),
                    this.options.disabled && this._setOptionDisabled(this.options.disabled),
                    this._trigger("create", null, this._getCreateEventData()),
                    this._init();
            },
            _getCreateOptions: function () {
                return {};
            },
            _getCreateEventData: h.noop,
            _create: h.noop,
            _init: h.noop,
            destroy: function () {
                var i = this;
                this._destroy(),
                    h.each(this.classesElementLookup, function (t, e) {
                        i._removeClass(e, t);
                    }),
                    this.element.off(this.eventNamespace).removeData(this.widgetFullName),
                    this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
                    this.bindings.off(this.eventNamespace);
            },
            _destroy: h.noop,
            widget: function () {
                return this.element;
            },
            option: function (t, e) {
                var i,
                    s,
                    n,
                    o = t;
                if (0 === arguments.length) return h.widget.extend({}, this.options);
                if ("string" == typeof t)
                    if (((o = {}), (t = (i = t.split(".")).shift()), i.length)) {
                        for (s = o[t] = h.widget.extend({}, this.options[t]), n = 0; i.length - 1 > n; n++) (s[i[n]] = s[i[n]] || {}), (s = s[i[n]]);
                        if (((t = i.pop()), 1 === arguments.length)) return void 0 === s[t] ? null : s[t];
                        s[t] = e;
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                        o[t] = e;
                    }
                return this._setOptions(o), this;
            },
            _setOptions: function (t) {
                var e;
                for (e in t) this._setOption(e, t[e]);
                return this;
            },
            _setOption: function (t, e) {
                return "classes" === t && this._setOptionClasses(e), (this.options[t] = e), "disabled" === t && this._setOptionDisabled(e), this;
            },
            _setOptionClasses: function (t) {
                var e, i, s;
                for (e in t) (s = this.classesElementLookup[e]), t[e] !== this.options.classes[e] && s && s.length && ((i = h(s.get())), this._removeClass(s, e), i.addClass(this._classes({ element: i, keys: e, classes: t, add: !0 })));
            },
            _setOptionDisabled: function (t) {
                this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t), t && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"));
            },
            enable: function () {
                return this._setOptions({ disabled: !1 });
            },
            disable: function () {
                return this._setOptions({ disabled: !0 });
            },
            _classes: function (n) {
                function t(t, e) {
                    var i, s;
                    for (s = 0; t.length > s; s++)
                        (i = r.classesElementLookup[t[s]] || h()),
                            (i = n.add ? h(h.unique(i.get().concat(n.element.get()))) : h(i.not(n.element).get())),
                            (r.classesElementLookup[t[s]] = i),
                            o.push(t[s]),
                            e && n.classes[t[s]] && o.push(n.classes[t[s]]);
                }
                var o = [],
                    r = this;
                return (
                    (n = h.extend({ element: this.element, classes: this.options.classes || {} }, n)),
                    this._on(n.element, { remove: "_untrackClassesElement" }),
                    n.keys && t(n.keys.match(/\S+/g) || [], !0),
                    n.extra && t(n.extra.match(/\S+/g) || []),
                    o.join(" ")
                );
            },
            _untrackClassesElement: function (i) {
                var s = this;
                h.each(s.classesElementLookup, function (t, e) {
                    -1 !== h.inArray(i.target, e) && (s.classesElementLookup[t] = h(e.not(i.target).get()));
                });
            },
            _removeClass: function (t, e, i) {
                return this._toggleClass(t, e, i, !1);
            },
            _addClass: function (t, e, i) {
                return this._toggleClass(t, e, i, !0);
            },
            _toggleClass: function (t, e, i, s) {
                s = "boolean" == typeof s ? s : i;
                var n = "string" == typeof t || null === t,
                    o = { extra: n ? e : i, keys: n ? t : e, element: n ? this.element : t, add: s };
                return o.element.toggleClass(this._classes(o), s), this;
            },
            _on: function (r, a, t) {
                var u,
                    l = this;
                "boolean" != typeof r && ((t = a), (a = r), (r = !1)),
                    t ? ((a = u = h(a)), (this.bindings = this.bindings.add(a))) : ((t = a), (a = this.element), (u = this.widget())),
                    h.each(t, function (t, e) {
                        function i() {
                            return r || (!0 !== l.options.disabled && !h(this).hasClass("ui-state-disabled")) ? ("string" == typeof e ? l[e] : e).apply(l, arguments) : void 0;
                        }
                        "string" != typeof e && (i.guid = e.guid = e.guid || i.guid || h.guid++);
                        var s = t.match(/^([\w:-]*)\s*(.*)$/),
                            n = s[1] + l.eventNamespace,
                            o = s[2];
                        o ? u.on(n, o, i) : a.on(n, i);
                    });
            },
            _off: function (t, e) {
                (e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace),
                    t.off(e).off(e),
                    (this.bindings = h(this.bindings.not(t).get())),
                    (this.focusable = h(this.focusable.not(t).get())),
                    (this.hoverable = h(this.hoverable.not(t).get()));
            },
            _delay: function (t, e) {
                var i = this;
                return setTimeout(function () {
                    return ("string" == typeof t ? i[t] : t).apply(i, arguments);
                }, e || 0);
            },
            _hoverable: function (t) {
                (this.hoverable = this.hoverable.add(t)),
                    this._on(t, {
                        mouseenter: function (t) {
                            this._addClass(h(t.currentTarget), null, "ui-state-hover");
                        },
                        mouseleave: function (t) {
                            this._removeClass(h(t.currentTarget), null, "ui-state-hover");
                        },
                    });
            },
            _focusable: function (t) {
                (this.focusable = this.focusable.add(t)),
                    this._on(t, {
                        focusin: function (t) {
                            this._addClass(h(t.currentTarget), null, "ui-state-focus");
                        },
                        focusout: function (t) {
                            this._removeClass(h(t.currentTarget), null, "ui-state-focus");
                        },
                    });
            },
            _trigger: function (t, e, i) {
                var s,
                    n,
                    o = this.options[t];
                if (((i = i || {}), ((e = h.Event(e)).type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase()), (e.target = this.element[0]), (n = e.originalEvent))) for (s in n) s in e || (e[s] = n[s]);
                return this.element.trigger(e, i), !((h.isFunction(o) && !1 === o.apply(this.element[0], [e].concat(i))) || e.isDefaultPrevented());
            },
        }),
        h.each({ show: "fadeIn", hide: "fadeOut" }, function (o, r) {
            h.Widget.prototype["_" + o] = function (e, t, i) {
                "string" == typeof t && (t = { effect: t });
                var s,
                    n = t ? (!0 === t || "number" == typeof t ? r : t.effect || r) : o;
                "number" == typeof (t = t || {}) && (t = { duration: t }),
                    (s = !h.isEmptyObject(t)),
                    (t.complete = i),
                    t.delay && e.delay(t.delay),
                    s && h.effects && h.effects.effect[n]
                        ? e[o](t)
                        : n !== o && e[n]
                        ? e[n](t.duration, t.easing, i)
                        : e.queue(function (t) {
                              h(this)[o](), i && i.call(e[0]), t();
                          });
            };
        }),
        h.widget;
});
/*!
 * Drum widget
 *
 * @author Tigran Sargsyan <tigran.sn@gmail.com>
 * @license https://github.com/tigrr/drum/blob/master/LICENSE MIT
 */
("use strict");
!(function (n) {
    n.widget("tl.drum", {
        options: {
            classes: { "drum-viewport": "drum-viewport", "drum-drum": "drum-drum" },
            type: "number",
            min: 0,
            max: 1 / 0,
            step: 1,
            orderAsc: !0,
            watchOutside: !0,
            edgeLimit: 0.8,
            acceleration: 300,
            renderItemsNum: 100,
            maxSpinOffset: 500,
        },
        _create: function () {
            var r = this;
            for (var t in ((this._drumOffset = 0), (this._state = "standby"), (this.items = []), this.options)) this.options[t] = this._formatValue(t, this.options[t]);
            this._render(),
                this.element
                    .watchDrag({
                        dragstart: function (t, e) {
                            r.element.focus(),
                                "revolving" === r._state && (r._scrollToOffset(r._getCurrentOffset()), r._refillValuesAroundView()),
                                (r._state = "dragging"),
                                r._drumEl.css("transition", "none").addClass("dragging"),
                                r._trigger("dragstart", t, e);
                        },
                        drag: function (t, e) {
                            r._scrollToOffset(r._drumOffset + e.dy), r._trigger("drag", t, e);
                        },
                        dragend: function (t, e) {
                            var i,
                                s,
                                n,
                                o = r.options.acceleration;
                            (i = Math.abs(e.vy))
                                ? ((n = Math.pow(i, 2) / (2 * o)) > r.options.maxSpinOffset && (n = r.options.maxSpinOffset),
                                  (n *= (function (t) {
                                      return 0 === (t = +t) || isNaN(t) ? t : 0 < t ? 1 : -1;
                                  })(e.dy)),
                                  (n = r._drumOffset + n),
                                  (n = r._processOffset(n)),
                                  (s = (2 * Math.abs(n - r._drumOffset)) / i),
                                  r._drumEl.css({ transition: "transform " + s + "s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }),
                                  r._scrollToOffset(n),
                                  (r._state = "revolving"),
                                  setTimeout(function () {
                                      r._stopRevolving(t);
                                  }, 1e3 * s + 40))
                                : r._stopRevolving(t),
                                r._drumEl.removeClass("dragging"),
                                r._trigger("dragend", t, e);
                        },
                    })
                    .keydown(function (t) {
                        if (!(t.altKey || t.ctrlKey || t.shiftKey || t.metaKey))
                            switch (t.keyCode) {
                                case 38:
                                    r.selectPrev(), t.preventDefault();
                                    break;
                                case 40:
                                    r.selectNext(), t.preventDefault();
                            }
                    });
        },
        _stopRevolving: function (t) {
            "standby" !== this._state &&
                (this._refillValuesAroundView(),
                (this.options.value = this._formatValue("value", this._centerView().dataset.value)),
                this._updateValues("value", this.options.value),
                (this._state = "standby"),
                this._trigger("change", t, { value: this.options.value }));
        },
        _render: function () {
            var t = this.element[0];
            if ("SELECT" === t.nodeName || "INPUT" === t.nodeName) {
                if ("INPUT" === t.nodeName && "number" !== t.type) throw new Error('Input element must be of type "number"');
                ((this._origControl = t).style.display = "none"), (this.element = n("<div>").insertAfter(this.element));
            }
            if (
                (this._addClass(this.element, "drum-viewport"),
                this.element.attr("tabindex", 0).css({ display: "inline-block", "overflow-y": "hidden", "-moz-user-select": "none", "-ms-user-select": "none", "-webkit-user-select": "none", "user-select": "none" }),
                (this._drumEl = n('<div style="position: relative;">').appendTo(this.element)),
                this._addClass(this._drumEl, "drum-drum"),
                "SELECT" === t.nodeName || this.options.options || "select" === this.options.type)
            ) {
                if (((this.options.type = "select"), (this.options.min = this.options.max = this.options.step = void 0), this.element.attr("role", "listbox"), this.options.options)) this._setOption("options", this.options.options);
                else {
                    if ("SELECT" !== t.nodeName) throw new Error("Either options array or select element must be passed");
                    (this.options.value = t.value), this._setOption("options", this._parseSelectMenuOptions(n(t).find("option")));
                }
                void 0 === this.options.value && (this.options.value = this.options.options[0].value);
            } else
                (this.options.min || this.options.max || ("INPUT" === t.nodeName && "number" === t.type) || "number" === this.options.type) &&
                    ((this.options.type = "number"),
                    "INPUT" === t.nodeName &&
                        ("" !== t.min && (this.options.min = this._formatValue("min", t.min)),
                        "" !== t.max && (this.options.max = this._formatValue("max", t.max)),
                        "" !== t.step && (this.options.step = this._formatValue("step", t.step)),
                        "" !== t.value && (this.options.value = this._formatValue("value", t.value))),
                    void 0 === this.options.value && (this.options.value = "number" == typeof this.options.min ? this.options.min : 0),
                    this.element.attr("role", "spinbutton"),
                    this.element.attr("aria-valuemin", this.options.min),
                    this.element.attr("aria-valuemax", this.options.max),
                    this.element.attr("aria-valuenow", this.options.value),
                    this._fillValues());
            this._setOption("value", this.options.value, !1);
        },
        _drawItems: function (t) {
            var i = this,
                s = "";
            t.forEach(function (t) {
                var e = '<div class="drum-item" data-value="' + t.value + '">' + t.label + "</div>";
                i.options.orderAsc ? (s += e) : (s = e + s);
            }),
                this._drumEl.html(s);
        },
        _parseOption: function (t, e) {
            var i = this.element[0];
            return void 0 !== this.options[t] ? this.options[t] : "INPUT" === i.nodeName && "number" === i.type ? i[t] : e;
        },
        _parseSelectMenuOptions: function (t) {
            var i = this,
                s = [];
            return (
                t.each(function (t, e) {
                    s.push(i._parseSelectMenuOption(n(e), t));
                }),
                s
            );
        },
        _parseSelectMenuOption: function (t, e) {
            return { value: t.val(), label: t.text() };
        },
        _fillValues: function (t) {
            var e,
                i,
                s,
                n,
                o = [];
            for (
                t = t || this.options.value,
                    s = this.options.step || 1,
                    e = t - Math.floor((s * this.options.renderItemsNum) / 2),
                    "number" == typeof this.options.min && e < this.options.min && (e = this.options.min),
                    i = e + s * (this.options.renderItemsNum - 1),
                    "number" == typeof this.options.max && this.options.max < i && (i = this.options.max),
                    n = e;
                n <= i;
                n += s
            )
                o.push({ value: n, label: n });
            (this.items = o), this._drawItems(o);
        },
        _refillValuesAroundView: function (t) {
            var e, i, s;
            "number" === this.options.type &&
                (void 0 === t && (t = this._getValue()),
                (e = (this.options.orderAsc ? this.items[this.items.length - 1] : this.items[0]).value),
                (s = this._drumOffset),
                this._fillValues(t),
                (i = (this.options.orderAsc ? this.items[this.items.length - 1] : this.items[0]).value),
                this._drumEl.css("transition", "none"),
                this._scrollToOffset(s + this._drumEl.find(".drum-item")[0].offsetHeight * (e - i)));
        },
        _getValue: function () {
            return this._formatValue("value", this._getItemInView().dataset.value);
        },
        _formatValue: function (t, e) {
            switch (t) {
                case "value":
                case "min":
                case "max":
                case "step":
                    "number" === this.options.type && ((e = parseFloat(e)), isFinite(e) || (e = void 0));
                    break;
                case "type":
                    if ("number" !== e && "select" !== e) throw new Error('Wrong value for type: "' + e + '". The supported types are "number" and "select".');
                    break;
                case "orderAsc":
                case "watchOutside":
                    if ("boolean" != typeof e) throw new TypeError(t + " must be boolean. " + typeof e + " passed.");
                    break;
                case "options":
                    if (!Array.isArray(e)) throw new TypeError("Options option must be an array");
                    e = e.map(function (t) {
                        return "string" == typeof t ? { value: t, label: t } : { value: t.value, label: t.label };
                    });
                    break;
                case "minDragInterval":
                case "acceleration":
                case "renderItemsNum":
                case "maxSpinOffset":
                    if (((e = parseFloat(e)), !isFinite(e))) throw new TypeError(t + " must be number");
            }
            return e;
        },
        _setOption: function (t, e, i) {
            var s = this;
            if (void 0 === (e = this._formatValue(t, e))) throw new TypeError("Failed to set the " + t + " property on Drum: The provided value is non-finite.");
            if (-1 !== ["min", "max", "step"].indexOf(t) && "number" !== this.options.type) throw new TypeError("Failed to set the " + t + " property on Drum: " + t + " can only be set on widget type number.");
            if (
                ("value" === t && "number" === this.options.type && (null != this.options.min && e < this.options.min && (e = this.options.min), null != this.options.max && e > this.options.max && (e = this.options.max)),
                !(("min" === t && e >= this.options.max) || ("max" === t && e <= this.options.min)))
            )
                return (
                    "options" === t &&
                        ((this.items = e.slice()),
                        e.some(function (t) {
                            return t.value === s.options.value;
                        }) || (this.options.value = e[0].value),
                        this._drawItems(this.items)),
                    (this.options[t] = e),
                    this._updateValues(t, e),
                    "min" === t && this.options.value < e
                        ? this._setOption("value", e)
                        : "max" === t && this.options.value > e
                        ? this._setOption("value", e)
                        : void (
                              -1 !== ["min", "max", "step", "value", "options"].indexOf(t) && (this._refillValuesAroundView("value" === t ? e : null), this._centerView(this._drumEl.find('[data-value="' + this.options.value + '"]')[0], i))
                          )
                );
        },
        _updateValues: function (t, e) {
            var i = { value: "aria-valuenow", min: "aria-valuemin", max: "aria-valuemax" };
            this._origControl &&
                ("INPUT" !== this._origControl.nodeName || ("value" !== t && "max" !== t && "min" !== t && "step" !== t) || (this._origControl[t] = e),
                "SELECT" === this._origControl.nodeName &&
                    ("value" === t
                        ? (this._origControl.value = e)
                        : "options" === t &&
                          (this._origControl.innerHTML = e
                              .map(function (t) {
                                  return '<option value="' + t.value + '">' + t.label + "</option>";
                              })
                              .join("")))),
                t in i && (void 0 !== e ? this.element.attr(i[t], e) : this.element.removeAttr(i[t]));
        },
        _scrollToOffset: function (t) {
            if (void 0 === t) throw new Error("You must pass an offset value");
            (t = this._processOffset(t)), (this._drumOffset = t), this._drumEl.css({ transform: "translate(0," + t + "px)" });
        },
        _processOffset: function (t) {
            var e = this.options.edgeLimit,
                i = this.element[0].clientHeight;
            return Math.max(Math.min(t, e * i), -this._drumEl[0].offsetHeight + i * (1 - e));
        },
        _centerView: function (t, e) {
            var i,
                s = this;
            return (
                (e = !1 !== e),
                (t = t || this._getItemInView()),
                this._drumEl.find(".drum-item").removeClass("drum-item-current"),
                t.classList.add("drum-item-current"),
                (i = -t.offsetTop + this.element[0].clientHeight / 2 - t.offsetHeight / 2),
                clearTimeout(this._timer),
                e &&
                    (this._drumEl.css({ transition: "transform .13s cubic-bezier(0,.5,.85,1)" }),
                    (this._timer = setTimeout(function () {
                        s._drumEl.css("transition", "none");
                    }, 200))),
                this._scrollToOffset(i),
                t
            );
        },
        _getCurrentOffset: function () {
            return this._drumEl[0].getBoundingClientRect().top - this.element[0].getBoundingClientRect().top;
        },
        _getItemInView: function () {
            var t,
                e = this.element[0].getBoundingClientRect(),
                i = (e.left, e.width, e.top + e.height / 2),
                s = this._drumEl.children(),
                n = this._drumEl[0].getBoundingClientRect();
            return (
                (t = s[Math.max(0, Math.min(s.length - 1, Math.floor(((i - n.top) / n.height) * s.length)))]).classList.contains("drum-item") || (t = 0 < this._drumOffset ? this._drumEl.children()[0] : this._drumEl.children().last()[0]), t
            );
        },
        value: function (t) {
            if (void 0 === t) return this.options.value;
            this._setOptions({ value: t });
        },
        min: function (t) {
            if (void 0 === t) return this.options.min;
            this._setOptions({ min: t });
        },
        max: function (t) {
            if (void 0 === t) return this.options.max;
            this._setOptions({ max: t });
        },
        selectNext: function () {
            var t = this._getItemInView().nextElementSibling;
            return !!t && (this._setOption("value", t.dataset.value), t);
        },
        selectPrev: function () {
            var t = this._getItemInView().previousElementSibling;
            return !!t && (this._setOption("value", t.dataset.value), t);
        },
    });
})(jQuery),
    (function (i) {
        i.widget("tl.watchDrag", {
            options: { watchOutside: !0, minDragInterval: 100 },
            _create: function () {
                this._resetCoords(), this._on(this.element, { mousedown: this._eventsStart.mousedown, touchstart: this._eventsStart.mousedown });
            },
            _captureCoords: function (t) {
                var e = -1 !== ["touchstart", "touchmove", "touchend"].indexOf(t.type) ? t.touches[0].pageX : t.pageX,
                    i = -1 !== ["touchstart", "touchmove", "touchend"].indexOf(t.type) ? t.touches[0].pageY : t.pageY,
                    s = Date.now();
                return { x: e, y: i, t: s, dx: e - this._coords.x, dy: i - this._coords.y, dt: s - this._coords.t };
            },
            _updateCoords: function (t) {
                this._coords = t;
            },
            _resetCoords: function () {
                this._coords = { x: null, y: null, t: null, dx: 0, dy: 0, dt: 0 };
            },
            _eventsStart: {
                mousedown: function (t) {
                    if ("mousedown" !== t.type || 1 === t.which) {
                        t.preventDefault(),
                            t.stopPropagation(),
                            (this._listenOn = this.options.watchOutside ? i(window) : this.element),
                            this._on(this._listenOn, { mousemove: this._eventsDrag.mousemove, touchmove: this._eventsDrag.mousemove, mouseup: this._eventsDrag.mouseup, touchend: this._eventsDrag.mouseup }),
                            this._resetCoords();
                        var e = this._captureCoords(t);
                        (this._coords.x = e.x), (this._coords.y = e.y), (this._coords.t = e.t), this._trigger("dragstart", t, this._coords);
                    }
                },
            },
            _eventsDrag: {
                mousemove: function (t) {
                    var e = this._captureCoords(t);
                    this._updateCoords(e), this._trigger("drag", t, e);
                },
                mouseup: function (t) {
                    t.preventDefault(), t.stopPropagation();
                    var e = i.extend({}, this._coords);
                    Date.now() - this._coords.t <= this.options.minDragInterval ? ((e.vx = (e.dx / e.dt) * 1e3), (e.vy = (e.dy / e.dt) * 1e3)) : (e.vx = e.vy = 0),
                        this._off(this._listenOn, "mousemove mouseup touchmove touchend"),
                        this._trigger("dragend", t, e);
                },
            },
        });
    })(jQuery);
