import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import colors from 'vuetify/lib/util/colors';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colors.blue.darken3,
                    secondary: colors.red.lighten4, // #FFCDD2
                },
                variables: {
                    fontFamily: "'Open Sans', sans-serif",
                },
            },
        },
    },
    icons: {
        iconfont: 'mdi',
    },
});

export default vuetify;