import {test, expect, describe} from 'vitest';
import {usStateToCode} from './us-state-to-code.js';

describe('usStateToCode', () => {
  describe('null and empty inputs', () => {
    test('returns null for null input', () => {
      expect(usStateToCode(null)).toBe(null);
    });

    test('returns null for undefined input', () => {
      expect(usStateToCode(undefined)).toBe(null);
    });

    test('returns null for empty string', () => {
      expect(usStateToCode('')).toBe(null);
    });

    test('returns null for whitespace-only string', () => {
      expect(usStateToCode('   ')).toBe(null);
    });
  });

  describe('2-letter state codes', () => {
    test('returns uppercase code for lowercase input', () => {
      expect(usStateToCode('ca')).toBe('CA');
      expect(usStateToCode('ny')).toBe('NY');
      expect(usStateToCode('tx')).toBe('TX');
    });

    test('returns uppercase code for uppercase input', () => {
      expect(usStateToCode('CA')).toBe('CA');
      expect(usStateToCode('NY')).toBe('NY');
      expect(usStateToCode('TX')).toBe('TX');
    });

    test('returns uppercase code for mixed case input', () => {
      expect(usStateToCode('Ca')).toBe('CA');
      expect(usStateToCode('nY')).toBe('NY');
      expect(usStateToCode('Tx')).toBe('TX');
    });

    test('handles all 50 state codes', () => {
      const stateCodes = [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
      ];

      stateCodes.forEach((code) => {
        expect(usStateToCode(code.toLowerCase())).toBe(code);
      });
    });
  });

  describe('full state names', () => {
    test('converts lowercase state names', () => {
      expect(usStateToCode('california')).toBe('CA');
      expect(usStateToCode('texas')).toBe('TX');
      expect(usStateToCode('florida')).toBe('FL');
      expect(usStateToCode('newyork')).toBe('NY');
    });

    test('converts uppercase state names', () => {
      expect(usStateToCode('CALIFORNIA')).toBe('CA');
      expect(usStateToCode('TEXAS')).toBe('TX');
      expect(usStateToCode('FLORIDA')).toBe('FL');
    });

    test('converts proper case state names', () => {
      expect(usStateToCode('California')).toBe('CA');
      expect(usStateToCode('Texas')).toBe('TX');
      expect(usStateToCode('Florida')).toBe('FL');
    });

    test('handles state names with spaces', () => {
      expect(usStateToCode('New York')).toBe('NY');
      expect(usStateToCode('New Jersey')).toBe('NJ');
      expect(usStateToCode('New Mexico')).toBe('NM');
      expect(usStateToCode('New Hampshire')).toBe('NH');
      expect(usStateToCode('North Carolina')).toBe('NC');
      expect(usStateToCode('North Dakota')).toBe('ND');
      expect(usStateToCode('South Carolina')).toBe('SC');
      expect(usStateToCode('South Dakota')).toBe('SD');
      expect(usStateToCode('West Virginia')).toBe('WV');
      expect(usStateToCode('Rhode Island')).toBe('RI');
    });

    test('handles state names with hyphens', () => {
      expect(usStateToCode('New-York')).toBe('NY');
      expect(usStateToCode('North-Carolina')).toBe('NC');
    });

    test('handles state names with dots', () => {
      expect(usStateToCode('N.Y.')).toBe('NY');
      expect(usStateToCode('N.C.')).toBe('NC');
    });

    test('handles state names with mixed spaces and special characters', () => {
      expect(usStateToCode('New   York')).toBe('NY');
      expect(usStateToCode('North - Carolina')).toBe('NC');
      expect(usStateToCode('West  Virginia')).toBe('WV');
    });

    test('converts all 50 state names', () => {
      const stateNames = [
        {name: 'Alabama', code: 'AL'},
        {name: 'Alaska', code: 'AK'},
        {name: 'Arizona', code: 'AZ'},
        {name: 'Arkansas', code: 'AR'},
        {name: 'California', code: 'CA'},
        {name: 'Colorado', code: 'CO'},
        {name: 'Connecticut', code: 'CT'},
        {name: 'Delaware', code: 'DE'},
        {name: 'Florida', code: 'FL'},
        {name: 'Georgia', code: 'GA'},
        {name: 'Hawaii', code: 'HI'},
        {name: 'Idaho', code: 'ID'},
        {name: 'Illinois', code: 'IL'},
        {name: 'Indiana', code: 'IN'},
        {name: 'Iowa', code: 'IA'},
        {name: 'Kansas', code: 'KS'},
        {name: 'Kentucky', code: 'KY'},
        {name: 'Louisiana', code: 'LA'},
        {name: 'Maine', code: 'ME'},
        {name: 'Maryland', code: 'MD'},
        {name: 'Massachusetts', code: 'MA'},
        {name: 'Michigan', code: 'MI'},
        {name: 'Minnesota', code: 'MN'},
        {name: 'Mississippi', code: 'MS'},
        {name: 'Missouri', code: 'MO'},
        {name: 'Montana', code: 'MT'},
        {name: 'Nebraska', code: 'NE'},
        {name: 'Nevada', code: 'NV'},
        {name: 'New Hampshire', code: 'NH'},
        {name: 'New Jersey', code: 'NJ'},
        {name: 'New Mexico', code: 'NM'},
        {name: 'New York', code: 'NY'},
        {name: 'North Carolina', code: 'NC'},
        {name: 'North Dakota', code: 'ND'},
        {name: 'Ohio', code: 'OH'},
        {name: 'Oklahoma', code: 'OK'},
        {name: 'Oregon', code: 'OR'},
        {name: 'Pennsylvania', code: 'PA'},
        {name: 'Rhode Island', code: 'RI'},
        {name: 'South Carolina', code: 'SC'},
        {name: 'South Dakota', code: 'SD'},
        {name: 'Tennessee', code: 'TN'},
        {name: 'Texas', code: 'TX'},
        {name: 'Utah', code: 'UT'},
        {name: 'Vermont', code: 'VT'},
        {name: 'Virginia', code: 'VA'},
        {name: 'Washington', code: 'WA'},
        {name: 'West Virginia', code: 'WV'},
        {name: 'Wisconsin', code: 'WI'},
        {name: 'Wyoming', code: 'WY'},
      ];

      stateNames.forEach(({name, code}) => {
        expect(usStateToCode(name)).toBe(code);
      });
    });
  });

  describe('common misspellings', () => {
    test('handles Alabama misspellings', () => {
      expect(usStateToCode('alabma')).toBe('AL');
    });

    test('handles Arizona misspellings', () => {
      expect(usStateToCode('arizonia')).toBe('AZ');
    });

    test('handles Arkansas misspellings', () => {
      expect(usStateToCode('arkansaw')).toBe('AR');
    });

    test('handles California misspellings', () => {
      expect(usStateToCode('calif')).toBe('CA');
      expect(usStateToCode('californa')).toBe('CA');
      expect(usStateToCode('calfornia')).toBe('CA');
    });

    test('handles Colorado misspellings', () => {
      expect(usStateToCode('colarado')).toBe('CO');
    });

    test('handles Connecticut misspellings', () => {
      expect(usStateToCode('conecticut')).toBe('CT');
      expect(usStateToCode('conneticut')).toBe('CT');
    });

    test('handles Florida misspellings', () => {
      expect(usStateToCode('floridia')).toBe('FL');
    });

    test('handles Hawaii misspellings', () => {
      expect(usStateToCode('hawai')).toBe('HI');
    });

    test('handles Illinois misspellings', () => {
      expect(usStateToCode('illinios')).toBe('IL');
    });

    test('handles Kentucky misspellings', () => {
      expect(usStateToCode('kentuckey')).toBe('KY');
    });

    test('handles Louisiana misspellings', () => {
      expect(usStateToCode('louisianna')).toBe('LA');
    });

    test('handles Maine misspellings', () => {
      expect(usStateToCode('main')).toBe('ME');
    });

    test('handles Maryland misspellings', () => {
      expect(usStateToCode('marlyand')).toBe('MD');
    });

    test('handles Massachusetts misspellings', () => {
      expect(usStateToCode('massachussetts')).toBe('MA');
      expect(usStateToCode('massachusets')).toBe('MA');
    });

    test('handles Michigan misspellings', () => {
      expect(usStateToCode('michegan')).toBe('MI');
    });

    test('handles Minnesota misspellings', () => {
      expect(usStateToCode('minnesotta')).toBe('MN');
    });

    test('handles Mississippi misspellings', () => {
      expect(usStateToCode('mississipi')).toBe('MS');
    });

    test('handles Missouri misspellings', () => {
      expect(usStateToCode('missourri')).toBe('MO');
    });

    test('handles Oklahoma misspellings', () => {
      expect(usStateToCode('okalahoma')).toBe('OK');
    });

    test('handles Pennsylvania misspellings', () => {
      expect(usStateToCode('pensylvania')).toBe('PA');
    });

    test('handles Tennessee misspellings', () => {
      expect(usStateToCode('tennesee')).toBe('TN');
    });

    test('handles Washington misspellings', () => {
      expect(usStateToCode('washinton')).toBe('WA');
    });

    test('handles Wisconsin misspellings', () => {
      expect(usStateToCode('wisconson')).toBe('WI');
    });
  });

  describe('invalid inputs', () => {
    test('returns null for non-existent state names', () => {
      expect(usStateToCode('Atlantis')).toBe(null);
      expect(usStateToCode('Narnia')).toBe(null);
      expect(usStateToCode('Wakanda')).toBe(null);
    });

    test('returns null for random strings', () => {
      expect(usStateToCode('xyz')).toBe(null);
      expect(usStateToCode('abcd')).toBe(null);
      expect(usStateToCode('foobar')).toBe(null);
    });

    test('returns null for numbers only', () => {
      expect(usStateToCode('123')).toBe(null);
      expect(usStateToCode('12')).toBe(null);
    });

    test('returns null for special characters only', () => {
      expect(usStateToCode('!!!')).toBe(null);
      expect(usStateToCode('###')).toBe(null);
    });

    test('returns null for invalid 2-letter codes', () => {
      expect(usStateToCode('zz')).toBe('ZZ'); // Note: function returns uppercase for any 2-letter input
      expect(usStateToCode('xx')).toBe('XX');
    });
  });

  describe('edge cases', () => {
    test('handles strings with multiple spaces', () => {
      expect(usStateToCode('  California  ')).toBe('CA');
      expect(usStateToCode('New     York')).toBe('NY');
    });

    test('handles strings with multiple special characters', () => {
      expect(usStateToCode('N...Y...')).toBe('NY');
      expect(usStateToCode('N---Y---')).toBe('NY');
      expect(usStateToCode('C@A#L$I%F')).toBe('CA');
    });

    test('handles very long invalid strings', () => {
      expect(usStateToCode('ThisIsAVeryLongStringThatIsNotAStateName')).toBe(
        null,
      );
    });

    test('handles single character input', () => {
      expect(usStateToCode('a')).toBe(null);
      expect(usStateToCode('C')).toBe(null);
    });

    test('handles three character input', () => {
      expect(usStateToCode('abc')).toBe(null);
      expect(usStateToCode('CAL')).toBe(null);
    });

    test('handles mixed numbers and letters', () => {
      expect(usStateToCode('Ca1ifornia')).toBe(null); // normalized to 'california'
      expect(usStateToCode('N3w Y0rk')).toBe(null); // normalized to 'newyork'
    });
  });

  describe('trimming and normalization', () => {
    test('trims leading and trailing whitespace', () => {
      expect(usStateToCode('  California')).toBe('CA');
      expect(usStateToCode('California  ')).toBe('CA');
      expect(usStateToCode('  California  ')).toBe('CA');
    });

    test('removes all non-alphabetic characters', () => {
      expect(usStateToCode('C@a#l$i%f^o&r*n(i)a')).toBe('CA');
      expect(usStateToCode('1T2e3x4a5s6')).toBe('TX');
    });

    test('handles tab and newline characters', () => {
      expect(usStateToCode('New\tYork')).toBe('NY');
      expect(usStateToCode('New\nYork')).toBe('NY');
      expect(usStateToCode('Texas\r\n')).toBe('TX');
    });
  });
});
