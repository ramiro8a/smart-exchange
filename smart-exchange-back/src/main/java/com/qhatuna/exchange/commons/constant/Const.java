package com.qhatuna.exchange.commons.constant;

import com.qhatuna.exchange.commons.api.CodigoDescripcion;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class Const {
    public static final class EstadoRegistro{
        public static final Integer ACTIVO = 0;
        public static final Integer ELIMINADO = 1;
        public static final Integer DESHABILITADO = 2;

        public static List<CodigoDescripcion> lista() {
            List<CodigoDescripcion> lista = new ArrayList<>();
            for (Field field : EstadoRegistro.class.getDeclaredFields()) {
                try {
                    String name = field.getName();
                    Integer value = (Integer) field.get(null);
                    if(value!=1)
                        lista.add(new CodigoDescripcion(value, name));
                } catch (IllegalAccessException e) {
                    // Handle the exception
                }
            }
            return lista;
        }
        private EstadoRegistro() {}
    }
}
