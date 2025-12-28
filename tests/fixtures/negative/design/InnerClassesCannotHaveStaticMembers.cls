public class Outer {
    public class Inner {
        public static Integer value;
        public static void method() {
            // Static members in inner class - should trigger rule
        }
    }
}

