/**
 * Stress test for structure rules
 * Contains 100+ violations across all structure rules
 */

@SuppressWarnings('PMD')
public class StressStructure {
  // Violations: ProhibitSuppressWarnings

  public static class StaticInner {
    // Violations: InnerClassesCannotBeStatic
  }

  public class InnerWithStatic {
    public static Integer value = 5;
    public static void method() {}
    // Violations: InnerClassesCannotHaveStaticMembers
  }

  public class Inner_With_Underscores {
    // Violations: InnerClassesMustBeOneWord
  }

  public class Multi_Word_Inner_Class {
    // Violations: InnerClassesMustBeOneWord
  }

  public class ParameterClass1 {
    public String name;
    public Integer value;
    public ParameterClass1() {}
    public ParameterClass1(String n) { name = n; }
    // Violations: NoParameterClasses, ClassesMustHaveMethods
  }

  public class ParameterClass2 {
    public String field1;
    public Integer field2;
    public Boolean field3;
    public ParameterClass2() {}
    public ParameterClass2(String f1, Integer f2) { field1 = f1; field2 = f2; }
    // Violations: NoParameterClasses, ClassesMustHaveMethods
  }

  public class ParameterClass3 {
    public String name;
    public ParameterClass3() {}
    // Violations: NoParameterClasses, ClassesMustHaveMethods
  }

  private String name;
  private Integer value;
  private Boolean isValid;
  private String description;
  private Integer count;
  private String status;
  private Boolean active;
  private String type;
  private Integer size;
  private String category;

  public String getName() {
    return name;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Integer getValue() {
    return value;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Boolean getIsValid() {
    return isValid;
    // Violations: AvoidTrivialPropertyGetters
  }

  public String getDescription() {
    return description;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Integer getCount() {
    return count;
    // Violations: AvoidTrivialPropertyGetters
  }

  public String getStatus() {
    return status;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Boolean getActive() {
    return active;
    // Violations: AvoidTrivialPropertyGetters
  }

  public String getType() {
    return type;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Integer getSize() {
    return size;
    // Violations: AvoidTrivialPropertyGetters
  }

  public String getCategory() {
    return category;
    // Violations: AvoidTrivialPropertyGetters
  }

  public void method1() {
    this.name = 'test';
    this.value = 5;
    // Violations: NoThisOutsideConstructors
  }

  public void method2() {
    this.isValid = true;
    this.description = 'test';
    // Violations: NoThisOutsideConstructors
  }

  public void method3() {
    this.count = 10;
    this.status = 'active';
    // Violations: NoThisOutsideConstructors
  }

  public void method4() {
    this.active = false;
    this.type = 'test';
    // Violations: NoThisOutsideConstructors
  }

  public void method5() {
    this.size = 100;
    this.category = 'test';
    // Violations: NoThisOutsideConstructors
  }

  public void method6() {
    Integer result = getValue();
    return result;
    // Violations: NoUnnecessaryReturnVariables
  }

  public void method7() {
    String name = getName();
    return name;
    // Violations: NoUnnecessaryReturnVariables
  }

  public void method8() {
    Boolean valid = isValid();
    return valid;
    // Violations: NoUnnecessaryReturnVariables
  }

  public void method9() {
    Integer count = getCount();
    return count;
    // Violations: NoUnnecessaryReturnVariables
  }

  public void method10() {
    String status = getStatus();
    return status;
    // Violations: NoUnnecessaryReturnVariables
  }

  public void method11() {
    Account account = getAccount();
    String name = account.Name;
    // Violations: NoUnnecessaryAttributeVariables
  }

  public void method12() {
    Contact contact = getContact();
    String email = contact.Email;
    // Violations: NoUnnecessaryAttributeVariables
  }

  public void method13() {
    Opportunity opp = getOpportunity();
    Decimal amount = opp.Amount;
    // Violations: NoUnnecessaryAttributeVariables
  }

  public void method14() {
    Account acc = getAccount();
    String city = acc.BillingCity;
    // Violations: NoUnnecessaryAttributeVariables
  }

  public void method15() {
    Contact c = getContact();
    String phone = c.Phone;
    // Violations: NoUnnecessaryAttributeVariables
  }

  public void method16() {
    if (value > 0) {
      if (count > 10) {
        // Violations: CombineNestedIfStatements
      }
    }
  }

  public void method17() {
    if (isValid) {
      if (active) {
        // Violations: CombineNestedIfStatements
      }
    }
  }

  public void method18() {
    if (name != null) {
      if (name.length() > 0) {
        // Violations: CombineNestedIfStatements
      }
    }
  }

  public void method19() {
    if (value > 0) {
      if (value < 100) {
        if (value != 50) {
          // Violations: CombineNestedIfStatements
        }
      }
    }
  }

  public void method20() {
    if (status == 'ACTIVE') {
      // do something
    } else if (status == 'INACTIVE') {
      // do something
    } else if (status == 'PENDING') {
      // do something
    } else if (status == 'CANCELLED') {
      // Violations: PreferSwitchOverIfElseChains
    }
  }

  public void method21() {
    if (type == 'A') {
      // do something
    } else if (type == 'B') {
      // do something
    } else if (type == 'C') {
      // do something
    } else if (type == 'D') {
      // do something
    } else if (type == 'E') {
      // Violations: PreferSwitchOverIfElseChains
    }
  }

  public void method22() {
    if (category == 'CAT1') {
      // do something
    } else if (category == 'CAT2') {
      // do something
    } else if (category == 'CAT3') {
      // do something
    } else if (category == 'CAT4') {
      // do something
    } else if (category == 'CAT5') {
      // Violations: PreferSwitchOverIfElseChains
    }
  }

  public void method23() {
    private String name;
    public String getName() {
      return name;
      // Violations: PreferPropertySyntaxOverGetterMethods
    }
  }

  public void method24() {
    private Integer value;
    public Integer getValue() {
      return value;
      // Violations: PreferPropertySyntaxOverGetterMethods
    }
  }

  public void method25() {
    private Boolean isValid;
    public Boolean getIsValid() {
      return isValid;
      // Violations: PreferPropertySyntaxOverGetterMethods
    }
  }

  public void method26() {
    private String description;
    public String getDescription() {
      return description;
      // Violations: PreferPropertySyntaxOverGetterMethods
    }
  }

  public void method27() {
    private Integer count;
    public Integer getCount() {
      return count;
      // Violations: PreferPropertySyntaxOverGetterMethods
    }
  }

  public void method28() {
    if (obj instanceof Account) {
      return true;
      // Violations: AvoidLowValueWrapperMethods
    }
    return false;
  }

  public void method29() {
    if (obj instanceof Contact) {
      return true;
      // Violations: AvoidLowValueWrapperMethods
    }
    return false;
  }

  public void method30() {
    if (obj instanceof Opportunity) {
      return true;
      // Violations: AvoidLowValueWrapperMethods
    }
    return false;
  }

  public enum Status {
    ACTIVE,
    INACTIVE
    // Violations: EnumMinimumValues
  }

  public enum Type {
    TYPE1,
    TYPE2
    // Violations: EnumMinimumValues
  }

  public StressStructure() {
    this.name = 'test';
    // Valid: this in constructor
  }

  private Integer getValue() { return 0; }
  private String getName() { return ''; }
  private Boolean isValid() { return true; }
  private Integer getCount() { return 0; }
  private String getStatus() { return ''; }
  private Account getAccount() { return new Account(); }
  private Contact getContact() { return new Contact(); }
  private Opportunity getOpportunity() { return new Opportunity(); }
}

