import React, { useEffect, useState } from 'react'
import { FormLayout } from '../../lib/Layout/FormLayout'
import { CheckboxContext } from './CheckboxContext'
// @ts-ignore
import CheckboxStyles from './Checkbox.module.css'
// import { useFormContext } from '../Form/FormContext'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  afterLabel?: string
  beforeLabel?: string
  description?: string
  label?: string
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
}

interface GroupProps {
  id?: string
  layout?: 'horizontal' | 'vertical'
  error?: any
  descriptionText?: any
  label?: any
  afterLabel?: string
  beforeLabel?: string
  labelOptional?: any
  name?: any
  value?: any
  className?: string
  children?: React.ReactNode
  options?: Array<InputProps>
  defaultValue?: string
  onChange?(x: React.ChangeEvent<HTMLInputElement>): void
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
}

function Group({
  id,
  layout = 'vertical',
  error,
  descriptionText,
  label,
  afterLabel,
  beforeLabel,
  labelOptional,
  children,
  className,
  options,
  onChange,
  size = 'medium',
}: GroupProps) {
  const parentCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (onChange) onChange(e)
  }

  return (
    <FormLayout
      label={label}
      afterLabel={afterLabel}
      beforeLabel={beforeLabel}
      labelOptional={labelOptional}
      layout={layout}
      id={id}
      error={error}
      descriptionText={descriptionText}
      className={className}
      size={size}
    >
      <CheckboxContext.Provider value={{ parentCallback, parentSize: size }}>
        {options
          ? options.map((option: InputProps) => {
              return (
                <Checkbox
                  id={option.id}
                  value={option.value}
                  label={option.label}
                  beforeLabel={option.beforeLabel}
                  afterLabel={option.afterLabel}
                  checked={option.checked}
                  name={option.name}
                  description={option.description}
                />
              )
            })
          : children}
      </CheckboxContext.Provider>
    </FormLayout>
  )
}

export function Checkbox({
  className,
  id = '',
  name = '',
  label,
  afterLabel,
  beforeLabel,
  description,
  checked,
  value,
  onChange,
  onFocus,
  onBlur,
  size = 'medium',
  disabled = false,
  ...props
}: InputProps) {
  // const { formContextOnChange, values, handleBlur } = useFormContext()

  return (
    <CheckboxContext.Consumer>
      {({ parentCallback, parentSize }) => {
        // if id does not exist, use label
        const markupId = id
          ? id
          : name
          ? name
          : label
          ? label
              .toLowerCase()
              .replace(/^[^A-Z0-9]+/gi, '')
              .replace(/ /g, '-')
          : undefined

        // if name does not exist on Radio then use Context Name from Radio.Group
        // if that fails, use the id
        const markupName = name ? name : markupId

        // check if checkbox checked is true or false
        // if neither true or false the checkbox will rely on native control
        let active = checked ?? undefined

        // if (values && !value) value = values[id || name]

        let containerClasses = [
          CheckboxStyles['sbui-checkbox-container'],
          CheckboxStyles[
            `sbui-checkbox-container--${parentSize ? parentSize : size}`
          ],
        ]
        if (className) containerClasses.push(className)

        // if (values && checked === undefined) active = values[id || name]
        // if (handleBlur) onBlur = handleBlur

        function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
          // '`onChange` callback for parent component
          if (parentCallback) parentCallback(e)
          // '`onChange` callback for this component
          if (onChange) onChange(e)
          // update form
          // if (formContextOnChange) formContextOnChange(e)
        }

        return (
          <div className={containerClasses.join(' ')}>
            <input
              id={markupId}
              name={markupName}
              type="checkbox"
              className={CheckboxStyles['sbui-checkbox']}
              onChange={onInputChange}
              onFocus={onFocus ? (event) => onFocus(event) : undefined}
              onBlur={onBlur}
              checked={active}
              value={value ? value : markupId}
              disabled={disabled}
              {...props}
            />
            <div className={CheckboxStyles['sbui-checkbox__label-container']}>
              <label
                className={
                  CheckboxStyles['sbui-checkbox__label-container__label']
                }
                htmlFor={markupId}
              >
                <span
                  className={
                    CheckboxStyles[
                      'sbui-checkbox__label-container__label__span'
                    ]
                  }
                >
                  {beforeLabel && (
                    <span
                      className={
                        CheckboxStyles['sbui-checkbox__label-text-before']
                      }
                    >
                      {beforeLabel}
                    </span>
                  )}
                  {label}
                  {afterLabel && (
                    <span
                      className={
                        CheckboxStyles['sbui-checkbox__label-text-after']
                      }
                    >
                      {afterLabel}
                    </span>
                  )}
                </span>

                {description && (
                  <p
                    className={
                      CheckboxStyles['sbui-checkbox__label-container__label__p']
                    }
                  >
                    {description}
                  </p>
                )}
              </label>
            </div>
          </div>
        )
      }}
    </CheckboxContext.Consumer>
  )
}

Checkbox.Group = Group
export default Checkbox
