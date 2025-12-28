public class Example {
    public void method() {
        // Valid: Boolean type (NOT switch-compatible)
        Boolean flag = true;
        if (flag == true) {
            doTrue();
        } else if (flag == false) {
            doFalse();
        }
        
        // Valid: Decimal type (NOT switch-compatible)
        Decimal dec = 1.5;
        if (dec == 1.5) {
            processOne();
        } else if (dec == 2.5) {
            processTwo();
        } else if (dec == 3.5) {
            processThree();
        }
        
        // Valid: Double type (NOT switch-compatible)
        Double dbl = 1.0;
        if (dbl == 1.0) {
            processOne();
        } else if (dbl == 2.0) {
            processTwo();
        }
        
        // Valid: Date type (NOT switch-compatible)
        Date dt = Date.today();
        if (dt == Date.today()) {
            processToday();
        } else if (dt == Date.today().addDays(1)) {
            processTomorrow();
        }
        
        // Valid: DateTime type (NOT switch-compatible)
        DateTime dtm = DateTime.now();
        if (dtm == DateTime.now()) {
            processNow();
        } else if (dtm == DateTime.now().addHours(1)) {
            processLater();
        }
        
        // Valid: Time type (NOT switch-compatible)
        Time tm = Time.newInstance(12, 0, 0, 0);
        if (tm == Time.newInstance(12, 0, 0, 0)) {
            processNoon();
        } else if (tm == Time.newInstance(18, 0, 0, 0)) {
            processEvening();
        }
        
        // Valid: Id type (NOT switch-compatible)
        Id recordId = '001000000000000AAA';
        if (recordId == '001000000000000AAA') {
            processId1();
        } else if (recordId == '001000000000000BBB') {
            processId2();
        }
        
        // Valid: Blob type (NOT switch-compatible)
        Blob data = Blob.valueOf('test');
        if (data == Blob.valueOf('test')) {
            processBlob1();
        } else if (data == Blob.valueOf('other')) {
            processBlob2();
        }
    }
}

