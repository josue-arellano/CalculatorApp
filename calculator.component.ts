import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component ({
    selector: 'calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
    constructor() {}
    expressionString = new FormControl('')
    solutionString = new FormControl('')

    updateExpression(string) {
        this.expressionString.setValue(this.expressionString.value + string)
    }
    wrongSyntax = false
    dividingByZero = false
    
    //These variables and
    a = null
    b = null
    op = null

    pop() {
        let x
        if(this.b == null) {
            x = this.a
            this.a = null
        } else {
            x = this.b
            this.b = null
        }
        console.log(x)
        return x
    }
    push(val) {
        if(this.a == null) this.a = val
        else this.b = val
    }

    checkExpression() {
        if(/^\d+(?:\s[\*\+\/-]\s\d+)*$/.test(this.expressionString.value)) {
            this.wrongSyntax = false
            this.solve()
        } 
        else {
            this.wrongSyntax = true
        }
    }

    solve() {
        var tokens = this.expressionString.value.split(" ")
        for (let index = 0; index < tokens.length; index++) {
            const element = tokens[index]
            if(/^\d+$/.test(element)){
                let num = parseInt(element)
                this.push(num)
            } else {
                if( element == '*' || element == '/') {
                    let x = this.pop()
                    index++
                    let y = tokens[index]
                    let c
                    if(element == '/') {
                        if(y == 0) {
                            index = tokens.length
                            this.dividingByZero = true
                            this.solutionString.setValue("ERR")
                        } else c = x / y
                    } else c = x * y
                    this.push(c)
                } else {
                    if(this.op == null) this.op = element
                    else {
                        let y = this.pop()
                        let x = this.pop()
                        let ans = this.op == '+' ? x + y: x - y
                        this.push(ans)
                        this.op = element
                    }
                }
            }
        }
        if(this.op == null) this.solutionString.setValue(Math.round(this.pop() * 100) / 100)
        else {
            let y = this.pop()
            let x = this.pop()
            let ans = null
            if(this.op == '*') ans = x * y
            else if(this.op == '/')  {
                if(y == 0) {
                    this.dividingByZero = true
                    this.solutionString.setValue('')
                } else ans = x / y
            }
            else if(this.op == '+') ans = x + y
            else ans = x - y
            if(ans != null) this.solutionString.setValue(Math.round(ans.toFixed(2) * 100) / 100)
        }
        this.a = this.b = this.op = null
    }

    clear() {
        this.a = this.b = this.op = null
        this.dividingByZero = this.wrongSyntax = false
        this.expressionString.setValue('')
        this.solutionString.setValue('')
    }
}