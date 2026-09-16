export interface FormulaSnippet {
  label: string;
  code: string;
  description: string;
}

export interface SubjectCategory {
  id: string;
  name: string;
  snippets: FormulaSnippet[];
}

export const FORMULA_CATEGORIES: SubjectCategory[] = [
  {
    id: 'math',
    name: 'Mathematics',
    snippets: [
      { label: 'Fraction', code: '$\\frac{a}{b}$', description: 'Fraction' },
      { label: 'Power', code: '$x^{2}$', description: 'Superscript exponent' },
      { label: 'Subscript', code: '$x_{1}$', description: 'Variable subscript' },
      { label: 'Square Root', code: '$\\sqrt{x}$', description: 'Radical' },
      { label: 'Quadratic', code: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', description: 'Quadratic formula' },
      { label: 'Integral', code: '$\\int_{a}^{b} f(x)\\,dx$', description: 'Definite integral' },
      { label: 'Summation', code: '$\\sum_{i=1}^{n} x_i$', description: 'Sigma sum' },
      { label: '2x2 Matrix', code: '$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$', description: 'Matrix' },
      { label: 'Plus/Minus', code: '$\\pm$', description: 'Plus-minus' },
      { label: 'Pi & Theta', code: '$\\pi, \\theta$', description: 'Greek letters' },
    ],
  },
  {
    id: 'chem',
    name: 'Chemistry',
    snippets: [
      { label: 'Sulfuric Acid', code: '$H_2SO_4$', description: 'Formula with subscripts' },
      { label: 'Water', code: '$H_2O$', description: 'Chemical formula' },
      { label: 'Ion Charges', code: '$Ca^{2+} + SO_4^{2-}$', description: 'Ionic charges' },
      { label: 'Reaction Arrow', code: '$\\rightarrow$', description: 'Yields' },
      { label: 'Equilibrium', code: '$\\rightleftharpoons$', description: 'Reversible reaction' },
      { label: 'Precipitate', code: '$\\downarrow$', description: 'Precipitate solid' },
      { label: 'Gas Released', code: '$\\uparrow$', description: 'Gas evolution' },
      { label: 'Reaction Eq', code: '$2H_2 + O_2 \\rightarrow 2H_2O$', description: 'Combustion equation' },
      { label: 'States', code: '$(s), (l), (g), (aq)$', description: 'Physical state symbols' },
    ],
  },
  {
    id: 'phys',
    name: 'Physics',
    snippets: [
      { label: 'Vector', code: '$\\vec{F} = m\\vec{a}$', description: 'Vector acceleration' },
      { label: 'Energy Eq', code: '$E = mc^2$', description: 'Mass-energy' },
      { label: 'Gravity Law', code: '$F = G\\frac{m_1 m_2}{r^2}$', description: 'Universal gravitation' },
      { label: 'Ohms Law', code: '$V = IR$', description: 'Resistance law' },
      { label: 'Kinematics', code: '$v = u + at$', description: 'Velocity formula' },
      { label: 'Units', code: '$\\text{m/s}^2, \\Omega, \\mu\\text{F}$', description: 'Standard units' },
    ],
  },
  {
    id: 'bio',
    name: 'Biology',
    snippets: [
      { label: 'Genotype', code: '$X^H X^h$', description: 'Sex-linked allele' },
      { label: 'Cross', code: '$Rr \\times Rr$', description: 'Monohybrid cross' },
      { label: 'Punnett Table', code: '| | B | b |\n|---|---|---|\n| B | BB | Bb |\n| b | Bb | bb |', description: 'Punnett square grid' },
      { label: 'Species', code: '*Homo sapiens*', description: 'Binomial nomenclature' },
    ],
  },
  {
    id: 'acc',
    name: 'Accounting',
    snippets: [
      { label: 'Ledger Table', code: '| Date | Particulars | Debit (NGN) | Credit (NGN) |\n|---|---|---|---|\n| 2026-01-01 | Bank | 100,000 | - |\n| 2026-01-01 | Capital | - | 100,000 |', description: 'Debit & Credit ledger' },
      { label: 'Balance Sheet', code: '| Assets | NGN | Liabilities | NGN |\n|---|---|---|---|\n| Cash | 50,000 | Capital | 50,000 |', description: 'Balance sheet table' },
      { label: 'Total Double Line', code: '==NGN 500,000==', description: 'Double underline total' },
      { label: 'Currency', code: 'NGN, $, GBP, EUR', description: 'Currency symbols' },
    ],
  },
];
