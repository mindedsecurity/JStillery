function w(d) {
    var z = 23, u = '', c = this, g = 'fromCharCode', f = 'charCodeAt', k = 'length', j = 'String', t = c.String, v = t.fromCharCode, r, l, s;
    for (s = 0; s < d[k]; s++) {
        r = d[f](s);
        l = r ^ z;
        u += t.fromCharCode(l);
    }
    return u;
}
;
'crdc';
