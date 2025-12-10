const glossary_extraction_date = "2025-12-10 11:01:02";

const glossary_extraction_source = ['https://specifications.openehr.org/releases/BASE/latest/base_types.html', 'https://specifications.openehr.org/releases/RM/latest/common.html', 'https://specifications.openehr.org/releases/RM/latest/data_structures.html', 'https://specifications.openehr.org/releases/RM/latest/data_types.html', 'https://specifications.openehr.org/releases/RM/latest/demographic.html', 'https://specifications.openehr.org/releases/RM/latest/ehr_extract.html', 'https://specifications.openehr.org/releases/RM/latest/ehr.html', 'https://specifications.openehr.org/releases/RM/latest/integration.html', 'https://specifications.openehr.org/releases/RM/latest/support.html'];

const glossary_data = {
    "ACTION": {
        "attributes": {
            "description": {
                "description": "Description of the action that has been performed, in the form of an archetyped structure.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "instruction_details": {
                "description": "Details of the Instruction that caused this Action to be performed, if there was one.",
                "existence": "0..1",
                "type": [
                    "INSTRUCTION_DETAILS"
                ]
            },
            "ism_transition": {
                "description": "Details of transition in the Instruction state machine caused by this Action.",
                "existence": "1..1",
                "type": [
                    "ISM_TRANSITION"
                ]
            },
            "time": {
                "description": "Point in time at which this action completed.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Used to record a clinical action that has been performed, which may have been ad hoc, or due to the execution of an Activity in an Instruction workflow. Every Action corresponds to a careflow step of some kind or another.",
        "inherit": "CARE_ENTRY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_action_class"
    },
    "ACTIVITY": {
        "attributes": {
            "action_archetype_id": {
                "description": "Perl-compliant regular expression pattern, enclosed in  '//' delimiters, indicating the valid identifiers of archetypes for Actions corresponding to this Activity specification.\n\n\nDefaults to  /.*/, meaning any archetype.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "description": {
                "description": "Description of the activity, in the form of an archetyped structure.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "timing": {
                "description": "Timing of the activity, in the form of a parsable string. If used, the preferred syntax is ISO8601 'R' format, but other formats may be used including HL7 GTS.\n\n\nMay be omitted if:\n\n\n\n\ntiming is represented structurally in the description attribute (e.g. via archetyped elements), or\n\n\nunavailable, e.g. imported legacy data; in such cases, the INSTRUCTION.narrative should carry text that indicates the timing of its activities.",
                "existence": "0..1",
                "type": [
                    "DV_PARSABLE"
                ]
            }
        },
        "description": "Defines a single activity within an Instruction, such as a medication administration.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_activity_class"
    },
    "ACTOR": {
        "abstract": "true",
        "attributes": {
            "languages": {
                "description": "Languages which can be used to communicate with this actor, in preferred order of use (if known, else order irrelevant).",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_TEXT"
                ]
            },
            "roles": {
                "description": "Identifiers of the Version container for each Role played by this Party.",
                "existence": "0..1",
                "type": [
                    "List",
                    "PARTY_REF"
                ]
            }
        },
        "description": "Ancestor of all real-world types, including people and organisations. An actor is any real-world entity capable of taking on a role.",
        "inherit": "PARTY",
        "specialization": [
            "PERSON",
            "ORGANISATION",
            "GROUP",
            "AGENT"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_actor_class"
    },
    "ADDRESS": {
        "attributes": {
            "details": {
                "description": "Archetypable structured address.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Address of contact, which may be electronic or geographic.",
        "functions": {
            "type ()": {
                "description": "Type of address, e.g. electronic,  locality. Taken from value of inherited name attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_address_class"
    },
    "ADDRESSED_MESSAGE": {
        "attributes": {
            "addressees": {
                "description": "Intended recipients, in the form of internet addresses.",
                "existence": "1..1",
                "type": [
                    "List",
                    "String"
                ]
            },
            "message": {
                "description": "The content of the message.",
                "existence": "1..1",
                "type": [
                    "MESSAGE"
                ]
            },
            "sender": {
                "description": "Party sending the message.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "sender_reference": {
                "description": "Identification of message used by sender. This will be the same no matter how many times this message is sent to these recipients.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "urgency": {
                "description": "Urgency with which destination should deal with message:\n\n\n\n\n-1 - low\n\n\n0 - normal\n\n\n1 - high",
                "existence": "0..1",
                "type": [
                    "Integer"
                ]
            }
        },
        "description": "The concept of a message addressed to nominated recipients.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_addressed_message_class"
    },
    "ADMIN_ENTRY": {
        "attributes": {
            "data": {
                "description": "Content of the Admin Entry.\nThe data of the Entry; modelled in archetypes.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Entry subtype for administrative information, i.e. information about setting up the clinical process, but not itself clinically relevant. Archetypes will define contained information.\n\n\nUsed for administrative details of admission, episode, ward location, discharge, appointment (if not stored in a practice management or appointments system).\n\n\nNot to be used for any clinically significant information.",
        "inherit": "ENTRY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_admin_entry_class"
    },
    "AGENT": {
        "description": "Generic concept of any kind of agent, including devices, software systems, but not humans or organisations.",
        "inherit": "ACTOR",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_agent_class"
    },
    "ARCHETYPED": {
        "attributes": {
            "archetype_id": {
                "description": "Globally unique archetype identifier.",
                "existence": "1..1",
                "type": [
                    "ARCHETYPE_ID"
                ]
            },
            "rm_version": {
                "description": "Version of the openEHR reference model used to create this object. Expressed in terms of the release version string, e.g.  1.0 ,  1.2.4 .",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "template_id": {
                "description": "Globally unique template identifier, if a template was active at this point in the structure. Normally, a template would only be used at the top of a top-level structure, but the possibility exists for templates at lower levels.",
                "existence": "0..1",
                "type": [
                    "TEMPLATE_ID"
                ]
            }
        },
        "description": "Archetypes act as the configuration basis for the particular structures of instances defined by the reference model. To enable archetypes to be used to create valid data, key classes in the reference model act as  root  points for archetyping; accordingly, these classes have the archetype_details attribute set.\n\n\nAn instance of the class ARCHETYPED contains the relevant archetype identification information, allowing generating archetypes to be matched up with data instances.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_archetyped_class"
    },
    "ARCHETYPE_ID": {
        "description": "Identifier for archetypes. Ideally these would identify globally unique archetypes.\n\n\nLexical form: rm_originator  '-' rm_name  '-' rm_entity  '.' concept_name {  '-' specialisation }*  '.v' number.",
        "functions": {
            "domain_concept ()": {
                "description": "Name of the concept represented by this archetype, including specialisation, e.g. Biochemistry_result-cholesterol.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "qualified_rm_entity ()": {
                "description": "Globally qualified reference model entity, e.g.  openehr-EHR-OBSERVATION.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "rm_entity ()": {
                "description": "Name of the ontological level within the reference model to which this archetype is targeted, e.g. for openEHR,  folder ,  composition ,  section ,  entry .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "rm_name ()": {
                "description": "Name of the reference model, e.g. rim,  ehr_rm,  en13606 .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "rm_originator ()": {
                "description": "Organisation originating the reference model on which this archetype is based, e.g. openehr,  cen,  hl7 .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "specialisation ()": {
                "description": "Name of specialisation of concept, if this archetype is a specialisation of another archetype, e.g.  cholesterol .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "version_id ()": {
                "description": "Version of this archetype.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "inherit": "OBJECT_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_archetype_id_class"
    },
    "ATTESTATION": {
        "attributes": {
            "attested_view": {
                "description": "Optional visual representation of content attested e.g. screen image.",
                "existence": "0..1",
                "type": [
                    "DV_MULTIMEDIA"
                ]
            },
            "is_pending": {
                "description": "True if this attestation is outstanding; False means it has been completed.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "items": {
                "description": "Items attested, expressed as fully qualified runtime paths to the items in question. Although not recommended, these may include fine-grained items which have been attested in some other system. Otherwise it is assumed to be for the entire VERSION with which it is associated.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_EHR_URI"
                ]
            },
            "proof": {
                "description": "Proof of attestation.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "reason": {
                "description": "Reason of this attestation. Optionally coded by the openEHR Terminology group  attestation reason ; includes values like  authorisation ,  witness  etc.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            }
        },
        "description": "Record an attestation of a party (the committer) to item(s) of record content. An attestation is an explicit signing by one healthcare agent of particular content for various particular purposes, including:\n\n\n\n\nfor authorisation of a controlled substance or procedure (e.g. sectioning of patient under mental health act);\n\n\nwitnessing of content by senior clinical professional;\n\n\nindicating acknowledgement of content by intended recipient, e.g. GP who ordered a test result.",
        "inherit": "AUDIT_DETAILS",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_attestation_class"
    },
    "AUDIT_DETAILS": {
        "attributes": {
            "change_type": {
                "description": "Type of change. Coded using the openEHR Terminology  audit change type  group.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "committer": {
                "description": "Identity and optional reference into identity management service, of user who committed the item.",
                "existence": "1..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "description": {
                "description": "Reason for committal. This may be used to qualify the value in the change_type field. For example, if the change affects only the EHR directory, this field might be used to indicate 'Folder \"episode 2018-02-16\" added' or similar.",
                "existence": "0..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "system_id": {
                "description": "Identifier of the logical EHR system where the change was committed. This is almost always owned by the organisation legally responsible for the EHR, and is distinct from any application, or any hosting infrastructure.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "time_committed": {
                "description": "Time of committal of the item.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "The set of attributes required to document the committal of an information item to a repository.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_audit_details_class"
    },
    "AUTHORED_RESOURCE": {
        "abstract": "true",
        "attributes": {
            "description": {
                "description": "Description and lifecycle information of the resource.",
                "existence": "0..1",
                "type": [
                    "RESOURCE_DESCRIPTION"
                ]
            },
            "is_controlled": {
                "description": "True if this resource is under any kind of change control (even file copying), in which case revision history is created.",
                "existence": "0..1",
                "type": [
                    "Boolean"
                ]
            },
            "original_language": {
                "description": "Language in which this resource was initially authored. Although there is no language primacy of resources overall, the language of original authoring is required to ensure natural language translations can preserve quality. Language is relevant in both the description and ontology sections.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "revision_history": {
                "description": "The revision history of the resource. Only required if is_controlled = True (avoids large revision histories for informal or private editing situations).",
                "existence": "0..1",
                "type": [
                    "REVISION_HISTORY"
                ]
            },
            "translations": {
                "description": "List of details for each natural-language translation made of this resource, keyed by language. For each translation listed here, there must be corresponding sections in all language-dependent parts of the resource. The original_language does not appear in this list.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    "TRANSLATION_DETAILS"
                ]
            }
        },
        "description": "Abstract idea of an online resource created by a human author.",
        "functions": {
            "current_revision ()": {
                "description": "Most recent revision in revision_history if is_controlled else  (uncontrolled) .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "languages_available ()": {
                "description": "Total list of languages available in this resource, derived from original_language and translations.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "String"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/resource.html#_authored_resource_class"
    },
    "BASIC_DEFINITIONS": {
        "description": "Defines globally used constant values.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_basic_definitions_class"
    },
    "CAPABILITY": {
        "attributes": {
            "credentials": {
                "description": "The qualifications of the performer of the role for this capability. This might include professional qualifications and official identifications such as provider numbers etc.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "time_validity": {
                "description": "Valid time interval for the credentials of this capability.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE"
                ]
            }
        },
        "description": "Capability of a role, such as  ehr modifier ,  health care provider . Capability should be backed up by credentials.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_capability_class"
    },
    "CARE_ENTRY": {
        "abstract": "true",
        "attributes": {
            "guideline_id": {
                "description": "Optional external identifier of guideline creating this Entry if relevant.",
                "existence": "0..1",
                "type": [
                    "OBJECT_REF"
                ]
            },
            "protocol": {
                "description": "Description of the method (i.e. how) the information in this entry was arrived at. For OBSERVATIONs, this is a description of the method or instrument used. For EVALUATIONs, how the evaluation was arrived at. For INSTRUCTIONs, how to execute the Instruction. This may take the form of references to guidelines, including manually followed and executable; knowledge references such as a paper in Medline; clinical reasons within a larger care process.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "The abstract parent of all clinical ENTRY subtypes. A CARE_ENTRY defines protocol and guideline attributes for all clinical Entry subtypes.",
        "inherit": "ENTRY",
        "specialization": [
            "OBSERVATION",
            "EVALUATION",
            "INSTRUCTION"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_care_entry_class"
    },
    "CLUSTER": {
        "attributes": {
            "items": {
                "description": "Ordered list of items - CLUSTER or ELEMENT objects - under this CLUSTER.",
                "existence": "1..1",
                "type": [
                    "List",
                    "ITEM"
                ]
            }
        },
        "description": "The grouping variant of ITEM, which may contain further instances of ITEM, in an ordered list.",
        "inherit": "ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_cluster_class"
    },
    "CODE_PHRASE": {
        "attributes": {
            "code_string": {
                "description": "The key used by the terminology service to identify a concept or coordination of concepts. This string is most likely parsable inside the terminology service, but nothing can be assumed about its syntax outside that context.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "preferred_term": {
                "description": "Optional attribute to carry preferred term corresponding to the code or expression in code_string. Typical use in integration situations which create mappings, and representing data for which both a (non-preferred) actual term and a preferred term are both required.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "terminology_id": {
                "description": "Identifier of the distinct terminology from which the code_string (or its elements) was extracted.",
                "existence": "1..1",
                "type": [
                    "TERMINOLOGY_ID"
                ]
            }
        },
        "description": "A fully coordinated (i.e. all coordination has been performed) term from a terminology service (as distinct from a particular terminology).",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/foundation_types.html#_code_phrase_class"
    },
    "CODE_SET_ACCESS": {
        "description": "Defines an object providing proxy access to a code_set.",
        "functions": {
            "all_codes ()": {
                "description": "Return all codes known in this code set.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "CODE_PHRASE"
                ]
            },
            "has_code (a_code: String[1])": {
                "description": "True if code set knows about  'a_code'.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "has_lang (a_lang: String[1])": {
                "description": "True if code set knows about 'a_lang' .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "id ()": {
                "description": "External identifier of this code set.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_code_set_access_interface"
    },
    "COMPOSITION": {
        "attributes": {
            "category": {
                "description": "Temporal category of this Composition, i.e.\n\n\n\n\n431|persistent| - of potential life-time validity;\n\n\n451|episodic| - valid over the life of a care episode;\n\n\n433|event| - valid at the time of recording (long-term validity requires subsequent clinical assessment).\n\n\n\n\nor any other code defined in the openEHR terminology group 'category'.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "composer": {
                "description": "The person primarily responsible for the content of the Composition (but not necessarily its committal into the EHR system). This is the identifier which should appear on the screen. It may or may not be the person who entered the data. When it is the patient, the special self  instance of PARTY_PROXY will be used.",
                "existence": "1..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "content": {
                "description": "The content of this Composition.",
                "existence": "0..1",
                "type": [
                    "List",
                    "CONTENT_ITEM"
                ]
            },
            "context": {
                "description": "The clinical session context of this Composition, i.e. the contextual attributes of the clinical session.",
                "existence": "0..1",
                "type": [
                    "EVENT_CONTEXT"
                ]
            },
            "language": {
                "description": "Mandatory indicator of the localised language in which this Composition is written. Coded from openEHR Code Set  languages. The language of an Entry if different from the Composition is indicated in ENTRY.language.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "territory": {
                "description": "Name of territory in which this Composition was written. Coded from openEHR  countries  code set, which is an expression of the ISO 3166 standard.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            }
        },
        "description": "Content of one version in a VERSIONED_COMPOSITION. A Composition is considered the unit of modification of the record, the unit of transmission in record Extracts, and the unit of attestation by authorising clinicians. In this latter sense, it may be considered equivalent to a signed document.\n\n\n\n\n\nNote\n\n\nIt is strongly recommended that the inherited attribute uid be populated in Compositions, using the UID copied from the object_id() of the uid field of the enclosing VERSION object.\nFor example, the ORIGINAL_VERSION.uid 87284370-2D4B-4e3d-A3F3-F303D2F4F34B::uk.nhs.ehr1::2 would be copied to the uid field of the Composition.",
        "functions": {
            "is_persistent ()": {
                "description": "True if category is 431|persistent|, False otherwise. Useful for finding Compositions in an EHR which are guaranteed to be of interest to most users.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_composition_class"
    },
    "CONTACT": {
        "attributes": {
            "addresses": {
                "description": "A set of address alternatives for this contact purpose and time validity combination.",
                "existence": "1..1",
                "type": [
                    "List",
                    "ADDRESS"
                ]
            },
            "time_validity": {
                "description": "Valid time interval for this contact descriptor.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE"
                ]
            }
        },
        "description": "Description of a means of contact of a Party. Actual structure is archetyped.",
        "functions": {
            "purpose ()": {
                "description": "Purpose for which this contact is used, e.g. mail,  daytime phone, etc. Taken from value of inherited name attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_contact_class"
    },
    "CONTENT_ITEM": {
        "abstract": "true",
        "description": "Abstract ancestor of all concrete content types.",
        "inherit": "LOCATABLE",
        "specialization": [
            "SECTION",
            "ENTRY"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_content_item_class"
    },
    "CONTRIBUTION": {
        "attributes": {
            "audit": {
                "description": "Audit trail corresponding to the committal of this Contribution.",
                "existence": "1..1",
                "type": [
                    "AUDIT_DETAILS"
                ]
            },
            "uid": {
                "description": "Unique identifier for this Contribution.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "versions": {
                "description": "Set of references to Versions causing changes to this EHR. Each contribution contains a list of versions, which may include paths pointing to any number of versionable items, i.e. items of types such as COMPOSITION and FOLDER.",
                "existence": "1..1",
                "type": [
                    "List",
                    "OBJECT_REF"
                ]
            }
        },
        "description": "Documents a Contribution (change set) of one or more versions added to a change-controlled repository.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_contribution_class"
    },
    "DATA_STRUCTURE": {
        "abstract": "true",
        "description": "Abstract parent class of all data structure types. Includes the as_hierarchy function which can generate the equivalent CEN EN13606 single hierarchy for each subtype\u2019s physical representation. For example, the physical representation of an ITEM_LIST is List<ELEMENT>; its implementation of as_hierarchy will generate a CLUSTER containing the set of ELEMENT nodes from the list.",
        "functions": {
            "as_hierarchy ()": {
                "description": "Hierarchical equivalent of the physical representation of each subtype, compatible with CEN EN 13606 structures.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ITEM"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "specialization": [
            "ITEM_STRUCTURE"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_data_structure_class"
    },
    "DATA_VALUE": {
        "abstract": "true",
        "description": "Abstract parent of all DV_ data value types.\nServes as a common ancestor of all data value types in openEHR models.",
        "inherit": "OPENEHR_DEFINITIONS",
        "specialization": [
            "DV_BOOLEAN",
            "DV_STATE",
            "DV_IDENTIFIER",
            "DV_TEXT"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_data_value_class"
    },
    "DV_ABSOLUTE_QUANTITY": {
        "abstract": "true",
        "attributes": {
            "accuracy": {
                "description": "",
                "existence": "0..1",
                "type": [
                    "DV_AMOUNT"
                ]
            }
        },
        "description": "Abstract class defining the concept of quantified entities whose values are absolute with respect to an origin. Dates and Times are the main example.",
        "functions": {
            "add alias \"+\" (a_diff: DV_AMOUNT[1])": {
                "description": "Addition of a differential amount to this quantity.\n\n\nThe value of accuracy in the result is either:\n\n\n\n\nthe sum of the accuracies of the operands, if both present, or;\n\n\nunknown, if either or both operand accuracies are unknown.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_ABSOLUTE_QUANTITY"
                ]
            },
            "diff alias \"-\" (other: DV_ABSOLUTE_QUANTITY[1])": {
                "description": "Difference of two quantities.\n\n\nThe value of accuracy in the result is either:\n\n\n\n\nthe sum of the accuracies of the operands, if both present, or;\n\n\nunknown, if either or both operand accuracies are unknown.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_AMOUNT"
                ]
            },
            "subtract alias \"-\" (a_diff: DV_AMOUNT[1])": {
                "description": "Result of subtracting a differential amount from this quantity.\n\n\nThe value of accuracy in the result is either:\n\n\n\n\nthe sum of the accuracies of the operands, if both present, or;\n\n\nunknown, if either or both operand accuracies are unknown.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_ABSOLUTE_QUANTITY"
                ]
            }
        },
        "inherit": "DV_QUANTIFIED",
        "specialization": [
            "DV_TEMPORAL"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_absolute_quantity_class"
    },
    "DV_AMOUNT": {
        "abstract": "true",
        "attributes": {
            "accuracy": {
                "description": "Accuracy of measurement, expressed either as a half-range percent value (accuracy_is_percent = True) or a half-range quantity. A value of 0 means that accuracy is 100%, i.e. no error.\n\n\nA value of unknown_accuracy_value means that accuracy was not recorded.",
                "existence": "0..1",
                "type": [
                    "Real"
                ]
            },
            "accuracy_is_percent": {
                "description": "If True, indicates that when this object was created, accuracy was recorded as a percent value; if False, as an absolute quantity value.",
                "existence": "0..1",
                "type": [
                    "Boolean"
                ]
            }
        },
        "description": "Abstract class defining the concept of relative quantified  'amounts'. For relative quantities, the  + and  - operators are defined (unlike descendants of DV_ABSOLUTE_QUANTITY, such as the date/time types).",
        "functions": {
            "add alias \"+\" (other: DV_AMOUNT[1])": {
                "description": "Sum of this amount and another. The value of accuracy in the result is either:\n\n\n\n\nthe sum of the accuracies of the operands, if both present, or;\n\n\nboth operand accuracies are unknown_accuracy_value.\n\n\n\n\nIf the accuracy value is a percentage in one operand and not in the other, the form in the result is that of the larger operand.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_AMOUNT"
                ]
            },
            "is_equal (other: DV_AMOUNT[1])": {
                "description": "Return True if this DV_AMOUNT is considered equal to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_AMOUNT[1])": {
                "description": "True if this object is less than other. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "multiply alias \"*\" (factor: Real[1])": {
                "description": "Product of this Amount and factor.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_AMOUNT"
                ]
            },
            "negative alias \"-\" ()": {
                "description": "Negated version of current object, such as used for representing a difference, e.g. a weight loss.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_AMOUNT"
                ]
            },
            "subtract alias \"-\" (other: DV_AMOUNT[1])": {
                "description": "Difference of this amount and another. The value of accuracy in the result is either:\n\n\n\n\nthe sum of the accuracies of the operands, if both present, or;\n\n\nunknown, if either or both operand accuracies are unknown.\n\n\n\n\nIf the accuracy value is a percentage in one operand and not in the other, the form in the result is that of the larger operand.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_AMOUNT"
                ]
            },
            "valid_percentage (number: Ordered_Numeric[1])": {
                "description": "Test whether a number is a valid percentage, i.e. between 0 and 100.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_QUANTIFIED",
        "specialization": [
            "DV_QUANTITY",
            "DV_COUNT"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_amount_class"
    },
    "DV_BOOLEAN": {
        "attributes": {
            "value": {
                "description": "Boolean value of this item. Actual values may be language or implementation dependent.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            }
        },
        "description": "Items which are truly boolean data, such as true/false or yes/no answers. For such data, it is important to devise the meanings (usually questions in subjective data)  carefully, so that the only allowed results are in fact true or false.\n\n\nMisuse: The DV_BOOLEAN class should not be used as a replacement for naively modelled enumerated types such as male/female etc. Such values should be coded, and in any case the enumeration often has more than two values.",
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_boolean_class"
    },
    "DV_CODED_TEXT": {
        "attributes": {
            "defining_code": {
                "description": "The term of which the  value attribute is the textual rendition (i.e. rubric).",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            }
        },
        "description": "A text item whose value must be the rubric from a controlled terminology, the key (i.e. the 'code') of which is the defining_code attribute. In other words: a DV_CODED_TEXT is a combination of a CODE_PHRASE (effectively a code) and the rubric of that term, from a terminology service, in the language in which the data were authored.\n\n\nSince DV_CODED_TEXT is a subtype of DV_TEXT, it can be used in place of it, effectively allowing the type DV_TEXT to mean  a text item, which may optionally be coded.\n\n\nMisuse: If the intention is to represent a term code attached in some way to a fragment of plain text, DV_CODED_TEXT should not be used; instead use a DV_TEXT and a TERM_MAPPING to a CODE_PHRASE.",
        "inherit": "DV_TEXT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_coded_text_class"
    },
    "DV_COUNT": {
        "attributes": {
            "magnitude": {
                "description": "",
                "existence": "1..1",
                "type": [
                    "Integer64"
                ]
            },
            "normal_range": {
                "description": "Optional normal range.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_COUNT"
                ]
            },
            "other_reference_ranges": {
                "description": "Optional tagged other reference ranges for this value in its particular measurement context.",
                "existence": "0..1",
                "type": [
                    "List",
                    "REFERENCE_RANGE",
                    "DV_COUNT"
                ]
            }
        },
        "description": "Countable quantities. Used for countable types such as pregnancies and steps (taken by a physiotherapy patient), number of cigarettes smoked in a day.\n\n\nMisuse: Not to be used for amounts of physical entities (which all have units).",
        "functions": {
            "add alias \"+\" (other: DV_COUNT[1])": {
                "description": "Sum of this DV_COUNT and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_COUNT"
                ]
            },
            "is_strictly_comparable_to (other: DV_ORDERED[1])": {
                "description": "Return True.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_COUNT[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "multiply alias \"*\" (factor: Real[1])": {
                "description": "Product of this DV_COUNT and factor.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_COUNT"
                ]
            },
            "subtract alias \"-\" (other: DV_COUNT[1])": {
                "description": "Difference of this DV_COUNT and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_COUNT"
                ]
            }
        },
        "inherit": "DV_AMOUNT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_count_class"
    },
    "DV_DATE": {
        "attributes": {
            "value": {
                "description": "ISO8601 date string.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Represents an absolute point in time, as measured on the Gregorian calendar, and specified only to the day. Semantics defined by ISO 8601. Used for recording dates in real world time. The partial form is used for approximate birth dates, dates of death, etc.",
        "functions": {
            "add alias \"+\" (a_diff: DV_DURATION[1])": {
                "description": "Addition of a Duration to this Date.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DATE"
                ]
            },
            "diff alias \"-\" (other: DV_DATE[1])": {
                "description": "Difference between this Date and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "is_equal (other: DV_QUANTIFIED[1])": {
                "description": "Return True if this DV_QUANTIFIED is considered equal to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_strictly_comparable_to (other: DV_DATE[1])": {
                "description": "True, for any two Dates.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_DATE[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "Numeric value of the date as days since the calendar origin date 0001-01-01.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            },
            "subtract alias \"-\" (a_diff: DV_DURATION[1])": {
                "description": "Subtract a Duration from this Date.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DATE"
                ]
            }
        },
        "inherit": "DV_TEMPORAL, Iso8601_date",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_date_class"
    },
    "DV_DATE_TIME": {
        "attributes": {
            "value": {
                "description": "ISO8601 date/time string.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Represents an absolute point in time, specified to the second. Semantics defined by ISO 8601.\n\n\nUsed for recording a precise point in real world time, and for approximate time stamps, e.g. the origin of a HISTORY in an OBSERVATION which is only partially known.",
        "functions": {
            "add alias \"+\" (a_diff: DV_DURATION[1])": {
                "description": "Addition of a Duration to this Date/time.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DATE_TIME"
                ]
            },
            "diff alias \"-\" (other: DV_DATE_TIME[1])": {
                "description": "Difference between this Date/time and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "is_strictly_comparable_to (other: DV_DATE_TIME[1])": {
                "description": "True, for any two Date/times.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_DATE_TIME[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "Numeric value of the date/time as seconds since the calendar origin date/time 0001-01-01T00:00:00Z.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "double"
                ]
            },
            "subtract alias \"-\" (a_diff: DV_DURATION[1])": {
                "description": "Subtract a Duration from this Date/time.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "inherit": "DV_TEMPORAL, Iso8601_date_time",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_date_time_class"
    },
    "DV_DURATION": {
        "attributes": {
            "value": {
                "description": "ISO8601 duration string, including described deviations to support negative values and weeks.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Represents a period of time with respect to a notional point in time, which is not specified. A sign may be used to indicate the duration is  backwards  in time rather than forwards.\n\n\n\n\n\nNote\n\n\ntwo deviations from ISO 8601 are supported, the first, to allow a negative sign, and the second allowing the 'W' designator to be mixed with other designators. See time types section in the Foundation Types model.\n\n\n\n\n\nUsed for recording the duration of something in the real world, particularly when there is a need a) to represent the duration in customary format, i.e. days, hours, minutes etc, and b) if it will be used in computational operations with date/time quantities, i.e. additions, subtractions etc.\n\n\nMisuse: Durations cannot be used to represent points in time, or intervals of time.",
        "functions": {
            "add alias \"+\" (other: DV_DURATION[1])": {
                "description": "Sum of this Duration and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "is_strictly_comparable_to (other: DV_DURATION[1])": {
                "description": "True, for any two Durations.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_DURATION[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "Numeric value of the duration as a number of seconds. Computed using the method to_seconds() inherited from Iso8601_duration.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "multiply alias \"*\" (factor: Real[1])": {
                "description": "Product of this Duration and factor.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "negative alias \"-\" ()": {
                "description": "Negated version of current duration.\n\n\nAssuming the current duration is positive, the negated version represents a time prior to some origin point, or a negative age (e.g. so-called 'adjusted age' of premature infant).",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "subtract alias \"-\" (other: DV_DURATION[1])": {
                "description": "Difference of this Duration and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            }
        },
        "inherit": "DV_AMOUNT, Iso8601_duration",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_duration_class"
    },
    "DV_EHR_URI": {
        "description": "A DV_EHR_URI is a DV_URI which has the scheme name 'ehr', and which can only reference items in EHRs.\n\n\nUsed to reference items in an EHR, which may be the same as the current EHR (containing this link), or another.",
        "inherit": "DV_URI",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_ehr_uri_class"
    },
    "DV_ENCAPSULATED": {
        "abstract": "true",
        "attributes": {
            "charset": {
                "description": "Name of character encoding scheme in which this value is encoded. Coded from openEHR Code Set  character sets . Unicode is the default assumption in openEHR, with UTF-8 being the assumed encoding. This attribute allows for variations from these assumptions.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "language": {
                "description": "Optional indicator of the localised language in which the data is written, if relevant. Coded from openEHR Code Set languages.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            }
        },
        "description": "Abstract class defining the common meta-data of all types of encapsulated data.",
        "inherit": "DATA_VALUE",
        "specialization": [
            "DV_MULTIMEDIA",
            "DV_PARSABLE"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_encapsulated_class"
    },
    "DV_GENERAL_TIME_SPECIFICATION": {
        "description": "Specifies points in time in a general syntax. Based on the HL7v3 GTS data type.",
        "functions": {
            "calendar_alignment ()": {
                "description": "Calendar alignment extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "event_alignment ()": {
                "description": "Event alignment extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "institution_specified ()": {
                "description": "Extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_TIME_SPECIFICATION",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_general_time_specification_class"
    },
    "DV_IDENTIFIER": {
        "attributes": {
            "assigner": {
                "description": "Optional organisation that assigned the id to the item being identified.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "id": {
                "description": "The identifier value. Often structured, according to the definition of the issuing authority\u2019s rules.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "issuer": {
                "description": "Optional authority which issues the kind of id used in the id field of this object.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "type": {
                "description": "Optional identifier type, such as  prescription , or  Social Security Number . One day a controlled vocabulary might be possible for this.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Type for representing identifiers of real-world entities. Typical identifiers include drivers licence number, social security number, veterans affairs number, prescription id, order id, and so on.\n\n\nDV_IDENTIFIER is used to represent any identifier of a real thing, issued by some authority or agency.\n\n\nMisuse: DV_IDENTIFIER is not used to express identifiers generated by the infrastructure to refer to information items; the types OBJECT_ID and OBJECT_REF and subtypes are defined for this purpose.",
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_identifier_class"
    },
    "DV_INTERVAL<T>": {
        "description": "Generic class defining an interval (i.e. range) of a comparable type. An interval is a contiguous subrange of a comparable base type. Used to define intervals of dates, times, quantities (whose units match) and so on. The type parameter, T, must be a descendant of the type DV_ORDERED, which is necessary (but not sufficient) for instances to be compared (strictly_comparable is also needed).\n\n\nWithout the DV_INTERVAL class, quite a few more DV_ classes would be needed to express logical intervals, namely interval versions of all the date/time classes, and of quantity classes. Further, it allows the semantics of intervals to be stated in one place unequivocally, including the conditions for strict comparison.\n\n\nThe basic semantics are derived from the class Interval<T>, described in the support RM.",
        "inherit": "DATA_VALUE, Interval",
        "type": "Class"
    },
    "DV_MULTIMEDIA": {
        "attributes": {
            "alternate_text": {
                "description": "Text to display in lieu of multimedia display/replay.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "compression_algorithm": {
                "description": "Compression type, a coded value from the openEHR Integrity check code set. Void means no compression.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "data": {
                "description": "The actual data found at uri, if supplied inline.",
                "existence": "0..1",
                "type": [
                    "List",
                    "Byte"
                ]
            },
            "integrity_check": {
                "description": "Binary cryptographic integrity checksum.",
                "existence": "0..1",
                "type": [
                    "List",
                    "Byte"
                ]
            },
            "integrity_check_algorithm": {
                "description": "Type of integrity check, a coded value from the openEHR Integrity check code set.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "media_type": {
                "description": "Data media type coded from openEHR code set  media types  (interface for the IANA MIME types code set).",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "size": {
                "description": "Original size in bytes of unencoded encapsulated data. I.e. encodings such as base64, hexadecimal etc do not change the value of this attribute.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "thumbnail": {
                "description": "The thumbnail for this item, if one exists; mainly for graphics formats.",
                "existence": "0..1",
                "type": [
                    "DV_MULTIMEDIA"
                ]
            },
            "uri": {
                "description": "URI reference to electronic information stored outside the record as a file, database entry etc, if supplied as a reference.",
                "existence": "0..1",
                "type": [
                    "DV_URI"
                ]
            }
        },
        "description": "A specialisation of DV_ENCAPSULATED for audiovisual and bio-signal types. Includes further metadata relating to multimedia types which are not applicable to other subtypes of DV_ENCAPSULATED.",
        "functions": {
            "has_integrity_check ()": {
                "description": "Computed from the value of the integrity_check_algorithm attribute: True if an integrity check has been computed.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_compressed ()": {
                "description": "Computed from the value of the compression_algorithm attribute: True if  the  data is stored in compressed form.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_external ()": {
                "description": "Computed from the value of the uri attribute: True if  the data is stored externally to the record, as indicated by uri. A copy may also be stored internally, in which case is_expanded is also true.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_inline ()": {
                "description": "Computed from the value of the data attribute. True if  the  data is stored  in  expanded  form, ie within the EHR itself.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_ENCAPSULATED",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_multimedia_class"
    },
    "DV_ORDERED": {
        "abstract": "true",
        "attributes": {
            "normal_range": {
                "description": "Optional normal range.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL"
                ]
            },
            "normal_status": {
                "description": "Optional normal status indicator of value with respect to normal range for this value. Often included by lab, even if the normal range itself is not included. Coded by ordinals in series HHH, HH, H, (nothing), L, LL, LLL; see openEHR terminology group  normal_status.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "other_reference_ranges": {
                "description": "Optional tagged other reference ranges for this value in its particular measurement context.",
                "existence": "0..1",
                "type": [
                    "List",
                    "REFERENCE_RANGE"
                ]
            }
        },
        "description": "Abstract class defining the concept of ordered values, which includes ordinals as well as true quantities. It defines the functions  < and is_strictly_comparable_to(), the latter of which must evaluate to True for instances being compared with the  < function, or used as limits in the DV_INTERVAL<T> class.\n\n\nData value types which are to be used as limits in the DV_INTERVAL<T> class must inherit from this class, and implement the function is_strictly_comparable_to() to ensure that instances compare meaningfully. For example, instances of DV_QUANTITY can only be compared if they measure the same kind of physical quantity.",
        "functions": {
            "is_normal ()": {
                "description": "Value is in the normal range, determined by comparison of the value to normal_range if present, or by the normal_status marker if present.",
                "existence": "1..1",
                "prerequisite": "normal_range /= Void or normal_status /= Void",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_simple ()": {
                "description": "True if this quantity has no reference ranges.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_strictly_comparable_to (other: DV_ORDERED[1])": {
                "description": "Test if two instances are strictly comparable. Effected in descendants.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_ORDERED[1])": {
                "description": "True if this Ordered object is less than other. Redefined in descendants.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DATA_VALUE, Ordered",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_ordered_class"
    },
    "DV_ORDINAL": {
        "attributes": {
            "symbol": {
                "description": "Coded textual representation of this value in the enumeration, which may be strings made from  +  symbols, or other enumerations of terms such as  mild, moderate, severe, or even the same number series as the values, e.g. 1, 2, 3.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "value": {
                "description": "Value in ordered enumeration of values. Any integer value can be used.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            }
        },
        "description": "A data type that represents integral score values, e.g. pain, Apgar values, etc, where there is:\n\n\na) implied ordering,\nb) no implication that the distance between each value is constant, and\nc) the total number of values is finite;\nd) integer values only.\n\n\nNote that although the term 'ordinal' in mathematics means natural numbers only, here any integer is allowed, since negative and zero values are often used by medical professionals for values around a neutral point. Examples of sets of ordinal values:\n\n\n\n\n-3, -2, -1, 0, 1, 2, 3 \u2009\u2014\u2009reflex response values\n\n\n0, 1, 2                 \u2009\u2014\u2009Apgar values\n\n\n\n\nThis class is used for recording any clinical datum which is customarily recorded using symbolic values. Example: the results on a urinalysis strip, e.g. {neg, trace, +, , +} are used for leucocytes, protein, nitrites etc; for non-haemolysed blood {neg, trace, moderate}; for haemolysed blood {small, moderate, large}.\n\n\nFor scores or scales that include Real numbers (or might in the future, i.e. not fixed for all time, such as Apgar), use DV_SCALE. DV_SCALE may also be used in future for representing purely Integer-based scales, however, the DV_ORDINAL type should continue to be supported in software implementations in order to accommodate existing data that are instances of this type.",
        "functions": {
            "is_strictly_comparable_to (other: DV_ORDINAL[1])": {
                "description": "Test if this Ordinal is strictly comparable to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_ORDINAL[1])": {
                "description": "True if this Ordinal value is less than other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_ORDERED",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_ordinal_class"
    },
    "DV_PARAGRAPH": {
        "attributes": {
            "items": {
                "description": "Items making up the paragraph, each of which is a text item (which may have its own formatting, and/or have hyperlinks).",
                "existence": "1..1",
                "type": [
                    "List",
                    "DV_TEXT"
                ]
            }
        },
        "description": "DEPRECATED: use markdown formatted DV_TEXT instead.\n\n\nOriginal definition:\n\n\nA logical composite text value consisting of a series of DV_TEXTs, i.e. plain text (optionally coded) potentially with simple formatting, to form a larger tract of prose, which may be interpreted for display purposes as a paragraph.\n\n\nDV_PARAGRAPH is the standard way for constructing longer text items in summaries, reports and so on.",
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_paragraph_class"
    },
    "DV_PARSABLE": {
        "attributes": {
            "formalism": {
                "description": "Name of the formalism, e.g.  GLIF 1.0 ,  Proforma  etc.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "value": {
                "description": "The string, which may validly be empty in some syntaxes.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Encapsulated data expressed as a parsable String. The internal model of the data item is not described in the openEHR model in common with other encapsulated types, but in this case, the form of the data is assumed to be plaintext, rather than compressed or other types of large binary data.",
        "functions": {
            "size ()": {
                "description": "Size in bytes of value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            }
        },
        "inherit": "DV_ENCAPSULATED",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_parsable_class"
    },
    "DV_PERIODIC_TIME_SPECIFICATION": {
        "description": "Specifies periodic points in time, linked to the calendar (phase-linked), or a real world repeating event, such as  breakfast  (event-linked). Based on the HL7v3 data types PIVL<T> and EIVL<T>.\n\n\nUsed in therapeutic prescriptions, expressed as INSTRUCTIONs in the openEHR model.",
        "functions": {
            "calendar_alignment ()": {
                "description": "Calendar alignment extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "event_alignment ()": {
                "description": "Event alignment extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "institution_specified ()": {
                "description": "Extracted from value.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "period ()": {
                "description": "The period of the repetition, computationally derived from the syntax representation. Extracted from the  value' attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            }
        },
        "inherit": "DV_TIME_SPECIFICATION",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_periodic_time_specification_class"
    },
    "DV_PROPORTION": {
        "attributes": {
            "denominator": {
                "description": "Denominator of ratio.",
                "existence": "1..1",
                "type": [
                    "Real"
                ]
            },
            "normal_range": {
                "description": "Optional normal range.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_PROPORTION"
                ]
            },
            "numerator": {
                "description": "Numerator of ratio",
                "existence": "1..1",
                "type": [
                    "Real"
                ]
            },
            "other_reference_ranges": {
                "description": "Optional tagged other reference ranges for this value in its particular measurement context.",
                "existence": "0..1",
                "type": [
                    "List",
                    "REFERENCE_RANGE",
                    "DV_PROPORTION"
                ]
            },
            "precision": {
                "description": "Precision  to  which  the  numerator and denominator values of  the  proportion are expressed, in terms of number  of decimal places. The value 0 implies an integral quantity. The value -1 implies no limit, i.e. any number of decimal places.",
                "existence": "0..1",
                "type": [
                    "Integer"
                ]
            },
            "type": {
                "description": "Indicates semantic type of proportion, including percent, unitary etc.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            }
        },
        "description": "Models a ratio of values, i.e. where the numerator and denominator are both pure numbers. The valid_proportion_kind property of the PROPORTION_KIND class is used to control the type attribute to be one of a defined set.\n\n\nUsed for recording titers (e.g. 1:128), concentration ratios, e.g. Na:K (unitary denominator), albumin:creatinine ratio, and percentages, e.g. red cell distirbution width (RDW).\n\n\nMisuse: Should not be used to represent things like blood pressure which are often written using a  '/' character, giving the misleading impression that the item is a ratio, when in fact it is a structured value. Similarly, visual acuity, often written as (e.g.) \"6/24\" in clinical notes is not a ratio but an ordinal (which includes non-numeric symbols like CF = count fingers etc). Should not be used for formulations.",
        "functions": {
            "add alias \"+\" (other: DV_PROPORTION[1])": {
                "description": "Sum of two strictly comparable proportions.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_PROPORTION"
                ]
            },
            "is_equal (other: DV_PROPORTION[1])": {
                "description": "Return True if this DV_AMOUNT is considered equal to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_integral ()": {
                "description": "True if the numerator and denominator values are integers, i.e. if precision is 0.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_strictly_comparable_to (other: DV_ORDERED[1])": {
                "description": "Return True if the type of this proportion is the same as the type of other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_PROPORTION[1])": {
                "description": "True if this Proportion is less than  other. Only valid if is_strictly_comparable_to() is True.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "Effective magnitude represented by ratio.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Real"
                ]
            },
            "multiply alias \"*\" (factor: Real[1])": {
                "description": "Product of this Proportion and factor.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_PROPORTION"
                ]
            },
            "subtract alias \"-\" (other: DV_PROPORTION[1])": {
                "description": "Difference between two strictly comparable proportions.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_PROPORTION"
                ]
            }
        },
        "inherit": "PROPORTION_KIND, DV_AMOUNT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_proportion_class"
    },
    "DV_QUANTIFIED": {
        "abstract": "true",
        "attributes": {
            "accuracy": {
                "description": "Accuracy of measurement. Exact form of expression determined in descendants.",
                "existence": "0..1",
                "type": [
                    "Any"
                ]
            },
            "magnitude_status": {
                "description": "Optional status of magnitude with values:\n\n\n\n\n\"=\"   :   magnitude is a point value\n\n\n\"<\"   :   value is < magnitude\n\n\n\">\"   :   value is > magnitude\n\n\n\"<=\" : value is <= magnitude\n\n\n\">=\" : value is >= magnitude\n\n\n\"~\"   :   value is approximately magnitude\n\n\n\n\nIf not present, assumed meaning is  \"=\" .",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Abstract class defining the concept of true quantified values, i.e. values which are not only ordered, but which have a precise magnitude.",
        "functions": {
            "accuracy_unknown ()": {
                "description": "True if accuracy is not known, e.g. due to not being recorded or discernable.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_equal (other: DV_QUANTIFIED[1])": {
                "description": "Return True if this DV_QUANTIFIED is considered equal to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_QUANTIFIED[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Ordered_Numeric"
                ]
            },
            "valid_magnitude_status ()": {
                "description": "Test whether a string value is one of the valid values for the magnitude_status attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_ORDERED",
        "specialization": [
            "DV_AMOUNT"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_quantified_class"
    },
    "DV_QUANTITY": {
        "attributes": {
            "magnitude": {
                "description": "Numeric magnitude of the quantity.",
                "existence": "1..1",
                "type": [
                    "Real"
                ]
            },
            "precision": {
                "description": "Precision to which the value of the quantity is expressed, in terms of number of decimal places. The value 0 implies an integral quantity.\nThe value -1 implies no limit, i.e. any number of decimal places.",
                "existence": "0..1",
                "type": [
                    "Integer"
                ]
            },
            "units": {
                "description": "Quantity units, expressed as a code or syntax string from either UCUM (the default) or the units system specified in units_system, when set.\n\n\nIn either case, the value is the code or syntax - normally formed of standard ASCII - which is in principal not the same as the display string, although in simple cases such as 'm' (for meters) it will be.\n\n\nIf the units_display_name field is set, this may be used for display. If not, the implementations must effect the resolution of the units value to a display form locally, e.g. by lookup of reference tables, request to a terminology service etc.\n\n\nExample values from UCUM: \"kg/m^2\", \u201cmm[Hg]\", \"ms-1\", \"km/h\".",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "units_display_name": {
                "description": "Optional field containing the displayable form of the units field, e.g. '\u00b0C'.\n\n\nIf not set, the application environment needs to determine the displayable form.\n\n\n\n\n\nNote\n\n\nThe display name may be language-dependent for various older and non-systematic units. For this reason, it is not recommended to add unit display names to archetypes, only to templates (for localisation purposes).",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "units_system": {
                "description": "Optional field used to specify a units system from which codes in units are defined. Value is a URI identifying a terminology containing units concepts from the  (HL7 FHIR terminologies list).\n\n\nIf not set, the UCUM standard (case-sensitive codes) is assumed as the units system.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Quantitified type representing  scientific  quantities, i.e. quantities expressed as a magnitude and units. Units are expressed in the UCUM syntax (Unified Code for Units of Measure (UCUM), by Gunther Schadow and Clement J. McDonald of The Regenstrief Institute)  (case-sensitive form) by default, or another system if units_system is set.\n\n\nCan also be used for time durations, where it is more convenient to treat these as simply a number of seconds rather than days, months, years (in the latter case, DV_DURATION may be used).",
        "functions": {
            "add alias \"+\" (other: DV_QUANTITY[1])": {
                "description": "Sum of this DV_QUANTITY and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_QUANTITY"
                ]
            },
            "is_integral ()": {
                "description": "True if precision = 0, meaning that the magnitude is a whole number.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_strictly_comparable_to (other: DV_ORDERED[1])": {
                "description": "True if this quantity and other have the same units and also units_system if it exists.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_QUANTITY[1])": {
                "description": "True if this Quantified object is less than other. Based on comparison of magnitude. Only valid if is_strictly_comparable_to() is True.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "multiply alias \"*\" (factor: Real[1])": {
                "description": "Product of this DV_QUANTITY and factor.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_QUANTITY"
                ]
            },
            "subtract alias \"-\" (other: DV_QUANTITY[1])": {
                "description": "Difference of this DV_QUANTITY and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_QUANTITY"
                ]
            }
        },
        "inherit": "DV_AMOUNT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_quantity_class"
    },
    "DV_SCALE": {
        "attributes": {
            "symbol": {
                "description": "Coded textual representation of this value in the scale range, which may be strings made from symbols or other enumerations of terms such as  no breathlessness, very very slight, slight breathlessness. Codes come from archetypes.\n\n\nIn some cases, a scale may include values that have no code/symbol. In this case, the symbol will be a DV-CODED_TEXT including the terminology_id and a blank String value for code_string.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "value": {
                "description": "Real number value of Scale item.",
                "existence": "1..1",
                "type": [
                    "Real"
                ]
            }
        },
        "description": "A data type that represents scale values, where there is:\n\n\na) implied ordering,\nb) no implication that the distance between each value is constant, and\nc) the total number of values is finite;\nd) non-integer values are allowed.\n\n\nExample:\n\n\n\nBorg CR 10 Scale\n\n0    No Breathlessness at all\n0.5  Very Very Slight (Just Noticeable)\n1    Very Slight\n2    Slight Breathlessness\n3    Moderate\n... etc\n\n\n\nFor scores that include only Integers, DV_SCALE may also be used, but DV_ORDINAL should be supported to accommodate existing data instances of that type.",
        "functions": {
            "is_strictly_comparable_to (other: DV_SCALE[1])": {
                "description": "Test if this Scale value is strictly comparable to other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_SCALE[1])": {
                "description": "True if this Scale value is less than other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DV_ORDERED",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_scale_class"
    },
    "DV_STATE": {
        "attributes": {
            "is_terminal": {
                "description": "Indicates whether this state is a terminal state, such as  \"aborted\",  \"completed\" etc. from which no further transitions are possible.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "value": {
                "description": "The state name. State names are determined by a state/event table defined in archetypes, and coded using openEHR Terminology or local archetype terms, as specified by the archetype.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            }
        },
        "description": "For representing state values which obey a defined state machine, such as a variable  representing the states of an instruction or care process.\n\n\nDV_STATE is expressed as a String but its values are driven by archetype-defined  state machines. This provides a powerful way of capturing stateful complex processes  in simple data.",
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_state_class"
    },
    "DV_TEMPORAL": {
        "abstract": "true",
        "attributes": {
            "accuracy": {
                "description": "Time accuracy, expressed as a duration.",
                "existence": "0..1",
                "type": [
                    "DV_DURATION"
                ]
            }
        },
        "description": "Specialised temporal variant of DV_ABSOLUTE_QUANTITY whose diff type is DV_DURATION.",
        "functions": {
            "add alias \"+\" (a_diff: DV_DURATION[1])": {
                "description": "Addition of a Duration to this temporal entity.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEMPORAL"
                ]
            },
            "diff alias \"-\" (other: DV_TEMPORAL[1])": {
                "description": "Difference between this temporal entity and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "subtract alias \"-\" (a_diff: DV_DURATION[1])": {
                "description": "Subtract a Duration from this temporal entity.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEMPORAL"
                ]
            }
        },
        "inherit": "DV_ABSOLUTE_QUANTITY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_temporal_class"
    },
    "DV_TEXT": {
        "attributes": {
            "encoding": {
                "description": "Name of character encoding scheme in which this value is encoded. Coded from openEHR Code Set  character sets . Unicode is the default assumption in openEHR, with UTF-8 being the assumed encoding. This attribute allows for variations from these assumptions.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "formatting": {
                "description": "If set, contains one of the following values:\n\n\n\n\n\"plain\": use for plain text, possibly containing newlines, but otherwise unformatted (same as Void);\n\n\n\"plain_no_newlines\": use for text containing no newlines or other formatting;\n\n\n\"markdown\": use for markdown formatted text, strongly recommended in the format of the CommonMark specification.\n\n\n\n\nDEPRECATED usage: contains a string of the form \"name:value; name:value\u2026\u200b\" , e.g. \"font-weight : bold; font-family : Arial; font-size : 12pt;\". Values taken from W3C CSS2 properties lists for background and font .",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "hyperlink": {
                "description": "DEPRECATED: this field is deprecated; use markdown link/text in the value attribute, and \"markdown\" as the value of the formatting field.\n\n\nOriginal usage, prior to RM Release 1.0.4: Optional link sitting behind a section of plain text or coded term item.",
                "existence": "0..1",
                "type": [
                    "DV_URI"
                ]
            },
            "language": {
                "description": "Optional indicator of the localised language in which the value is written. Coded from openEHR Code Set  languages . Only used when either the text object is in a different language from the enclosing ENTRY, or else the text object is being used outside of an ENTRY or other enclosing structure which indicates the language.",
                "existence": "0..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "mappings": {
                "description": "Terms from other terminologies most closely matching this term, typically used where the originator (e.g. pathology lab) of information uses a local terminology but also supplies one or more equivalents from well known terminologies (e.g. LOINC).",
                "existence": "0..1",
                "type": [
                    "List",
                    "TERM_MAPPING"
                ]
            },
            "value": {
                "description": "Displayable rendition of the item, regardless of its underlying structure. For DV_CODED_TEXT, this is the rubric of the complete term as provided by the terminology service.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "A text item, which may contain any amount of legal characters arranged as e.g. words, sentences etc (i.e. one DV_TEXT may be more than one word). Visual formatting and hyperlinks may be included via markdown.\n\n\nIf the formatting field is set, the value field is affected as follows:\n\n\n\n\nformatting = \"plain\": plain text, may contain newlines;\n\n\nformatting = \"plain_no_newlines\": plain text with no newlines;\n\n\nformatting = \"markdown\": text in markdown format; use of CommonMark strongly recommended.\n\n\n\n\nA DV_TEXT can be coded by adding mappings to it.",
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_text_class"
    },
    "DV_TIME": {
        "attributes": {
            "value": {
                "description": "ISO8601 time string",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Represents an absolute point in time from an origin usually interpreted as meaning the start of the current day, specified to a fraction of a second. Semantics defined by ISO 8601.\n\n\nUsed for recording real world times, rather than scientifically measured fine amounts of time. The partial form is used for approximate times of events and substance administrations.",
        "functions": {
            "add alias \"+\" (a_diff: DV_DURATION[1])": {
                "description": "Addition of a Duration to this Time.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TIME"
                ]
            },
            "diff alias \"-\" (other: DV_TIME[1])": {
                "description": "Difference between this Time and other.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            },
            "is_strictly_comparable_to (other: DV_TIME[1])": {
                "description": "True, for any two Times.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "less_than alias \"<\" (other: DV_TIME[1])": {
                "description": "True if other is less than this Quantified object. Based on comparison of magnitude.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "magnitude ()": {
                "description": "Numeric value of the time as seconds since the start of day, i.e. 00:00:00.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Real"
                ]
            },
            "subtract alias \"-\" (a_diff: DV_DURATION[1])": {
                "description": "Subtract a Duration from this Time.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TIME"
                ]
            }
        },
        "inherit": "DV_TEMPORAL, Iso8601_time",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_time_class"
    },
    "DV_TIME_SPECIFICATION": {
        "abstract": "true",
        "attributes": {
            "value": {
                "description": "The specification, in the HL7v3 syntax for PIVL or EIVL types.",
                "existence": "1..1",
                "type": [
                    "DV_PARSABLE"
                ]
            }
        },
        "description": "This is an abstract class of which all timing specifications are specialisations. Specifies points in time, possibly linked to the calendar, or a real world repeating event, such as  breakfast.",
        "functions": {
            "calendar_alignment ()": {
                "description": "Indicates what prototypical point in the calendar the specification is aligned to, e.g.  5th of the month . Empty if not aligned. Extracted from the  value' attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "event_alignment ()": {
                "description": "Indicates what real-world event the specification is aligned to if any. Extracted from the  value' attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "institution_specified ()": {
                "description": "Indicates if the specification is aligned with institution schedules, e.g. a hospital nursing changeover or meal serving times. Extracted from the  value' attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DATA_VALUE",
        "specialization": [
            "DV_PERIODIC_TIME_SPECIFICATION",
            "DV_GENERAL_TIME_SPECIFICATION"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_time_specification_class"
    },
    "DV_URI": {
        "attributes": {
            "value": {
                "description": "Value of URI as a String. 'Plain-text' URIs are allowed, enabling better readability, but must be RFC-3986 encoded in use.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "A reference to an object which structurally conforms to the Universal Resource Identifier (URI) RFC-3986 standard. The reference is contained in the value attribute, which is a String. So-called 'plain-text URIs' that contain RFC-3986 forbidden characters such as spaces etc, are allowed on the basis that they need to be RFC-3986 encoded prior to use in e.g. REST APIs or other contexts relying on machine-level conformance.",
        "functions": {
            "fragment_id ()": {
                "description": "A part of, a  fragment  or  a  sub-function  within  an object. Allows references to sub-parts of objects, such as a certain line and character  position  in  a  text object. The  syntax  and semantics are defined by the application responsible for the object.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "path ()": {
                "description": "A string whose format is  a  function  of  the  scheme. Identifies   the   location  in  <scheme>-space  of  an information entity. Typical values include hierarchical directory  paths  for  any  machine.  For example, with scheme = \"ftp\", path might be \"/pub/images/image_01\". The strings \".\" and \"..\" are reserved for use in the path. Paths may include internet/intranet location identifiers of the form: sub_domain\u2026\u200bdomain, e.g. \"info.cern.ch\".",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "query ()": {
                "description": "Query string to send to application implied  by  scheme and  path.  Enables  queries  to applications, including databases  to  be  included in  the  URI. Supports any query meaningful to the server, including SQL.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "scheme ()": {
                "description": "A distributed information 'space' in which  information objects  exist. The scheme simultaneously specifies an information space and a mechanism for accessing objects in  that  space.  For  example  if  scheme  = \"ftp\", it identifies the information space in which  all  ftp-able objects  exist,  and also the application - ftp - which can be used to access them. Values may include: \"ftp\", \"telnet\", \"mailto\", etc. Refer to RFC-3986 for a full list.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "inherit": "DATA_VALUE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_dv_uri_class"
    },
    "EHR": {
        "attributes": {
            "ehr_id": {
                "description": "The unique identifier of this EHR.\n\n\n\n\n\nNote\n\n\nis is strongly recommended that a UUID always be used for this field.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "system_id": {
                "description": "The identifier of the logical EHR management system in which this EHR was created.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            }
        },
        "description": "The EHR object is the root object and access point of an EHR for a subject of care.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_ehr_class"
    },
    "EHR_ACCESS": {
        "attributes": {
            "settings": {
                "description": "Access control settings for the EHR. Instance is a subtype of the type ACCESS_CONTROL_SETTINGS, allowing for the use of different access control schemes.",
                "existence": "0..1",
                "type": [
                    "ACCESS_CONTROL_SETTINGS"
                ]
            }
        },
        "description": "EHR-wide access control object. All access decisions to data in the EHR must be made in accordance with the policies and rules in this object.\n\n\n\n\n\nNote\n\n\nIt is strongly recommended that the inherited attribute uid be populated in EHR_ACCESS objects, using the UID copied from the object_id() of the uid field of the enclosing VERSION object.\nFor example, the ORIGINAL_VERSION.uid 87284370-2D4B-4e3d-A3F3-F303D2F4F34B::uk.nhs.ehr1::2 would be copied to the uid field of the EHR_ACCESS object.",
        "functions": {
            "scheme ()": {
                "description": "The name of the access control scheme in use; corresponds to the concrete instance of the settings attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_ehr_access_class"
    },
    "EHR_STATUS": {
        "attributes": {
            "is_modifiable": {
                "description": "True if the EHR, other than the EHR_STATUS object, is allowed to be written to. The EHR_STATUS object itself can always be written to.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "is_queryable": {
                "description": "True if this EHR should be included in population queries, i.e. if this EHR is considered active in the population.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "other_details": {
                "description": "Any other details of the EHR summary object, in the form of an archetyped ITEM_STRUCTURE.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "subject": {
                "description": "The subject of this EHR. The external_ref attribute can be used to contain a direct reference to the subject in a demographic or identity service. Alternatively, the association between patients and their records may be done elsewhere for security reasons.",
                "existence": "1..1",
                "type": [
                    "PARTY_SELF"
                ]
            }
        },
        "description": "Single object per EHR containing various EHR-wide status flags and settings, including whether this EHR can be queried, modified etc. This object is always modifiable, in order to change the status of the EHR as a whole.\n\n\n\n\n\nNote\n\n\nIt is strongly recommended that the inherited attribute uid be populated in EHR_STATUS objects, using the UID copied from the object_id() of the uid field of the enclosing VERSION object.\nFor example, the ORIGINAL_VERSION.uid 87284370-2D4B-4e3d-A3F3-F303D2F4F34B::uk.nhs.ehr1::2  would be copied to the uid field of the EHR_STATUS object.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_ehr_status_class"
    },
    "ELEMENT": {
        "attributes": {
            "null_flavour": {
                "description": "Flavour of null value, e.g. 253|unknown|, 271|no information|, 272|masked|, and 273|not applicable|.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "null_reason": {
                "description": "Optional specific reason for null value; if set, null_flavour must be set. Null reason may apply only to a minority of clinical data, commonly needed in reporting contexts.",
                "existence": "0..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "value": {
                "description": "Property representing leaf value object of ELEMENT. In real data, any concrete subtype of DATA_VALUE can be used.",
                "existence": "0..1",
                "type": [
                    "DATA_VALUE"
                ]
            }
        },
        "description": "The leaf variant of ITEM, to which a DATA_VALUE instance is attached.",
        "functions": {
            "is_null ()": {
                "description": "True if value logically not known, e.g. if indeterminate, not asked etc.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_element_class"
    },
    "ENTRY": {
        "abstract": "true",
        "attributes": {
            "encoding": {
                "description": "Name of character set in which text values in this Entry are encoded. Coded from openEHR Code Set  character sets.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "language": {
                "description": "Mandatory indicator of the localised language in which this Entry is written. Coded from openEHR Code Set  languages .",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "other_participations": {
                "description": "Other participations at ENTRY level.",
                "existence": "0..1",
                "type": [
                    "List",
                    "PARTICIPATION"
                ]
            },
            "provider": {
                "description": "Optional identification of provider of the information in this ENTRY, which might be:\n\n\n\n\nthe patient\n\n\na patient agent, e.g. parent, guardian\n\n\nthe clinician\n\n\na device or software\n\n\n\n\nGenerally only used when the recorder needs to make it explicit. Otherwise, Composition composer and other participants are assumed.",
                "existence": "0..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "subject": {
                "description": "Id of human subject of this ENTRY, e.g.:\n\n\n\n\norgan donor\n\n\nfoetus\n\n\na family member\n\n\nanother clinically relevant person.",
                "existence": "1..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "workflow_id": {
                "description": "Identifier of externally held workflow engine data for this workflow execution, for this subject of care.",
                "existence": "0..1",
                "type": [
                    "OBJECT_REF"
                ]
            }
        },
        "description": "The abstract parent of all ENTRY subtypes. An ENTRY is the root of a logical item of  hard  clinical information created in the  clinical statement  context, within a clinical session. There can be numerous such contexts in a clinical session. Observations and other Entry types only ever document information captured/created in the event documented by the enclosing Composition.\n\n\nAn ENTRY is also the minimal unit of information any query should return, since a whole ENTRY (including subparts) records spatial structure, timing information, and contextual information, as well as the subject and generator of the information.",
        "functions": {
            "subject_is_self ()": {
                "description": "Returns True if this Entry is about the subject of the EHR, in which case the subject attribute is of type PARTY_SELF.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "CONTENT_ITEM",
        "specialization": [
            "ADMIN_ENTRY",
            "CARE_ENTRY"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_entry_class"
    },
    "EVALUATION": {
        "attributes": {
            "data": {
                "description": "The data of this evaluation, in the form of a spatial data structure.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Entry type for evaluation statements. Used for all kinds of statements which evaluate other information, such as interpretations of observations, diagnoses, differential diagnoses, hypotheses, risk assessments, goals and plans.\n\n\nShould not be used for actionable statements such as medication orders - these are represented using the INSTRUCTION type.",
        "inherit": "CARE_ENTRY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_evaluation_class"
    },
    "EVENT<T>": {
        "abstract": "true",
        "attributes": {
            "data": {
                "description": "The data of this event.",
                "existence": "1..1",
                "type": [
                    "T"
                ]
            },
            "state": {
                "description": "Optional state data for this event.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "time": {
                "description": "Time of this event. If the width is non-zero, it is the time point of the trailing edge of the event.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Defines the abstract notion of a single event in a series. This class is generic, allowing types to be generated which are locked to particular spatial types, such as EVENT<ITEM_LIST>. Subtypes express point or intveral data.",
        "functions": {
            "offset ()": {
                "description": "Offset of this event from origin, computed as time.diff(parent.origin).",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DURATION"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class"
    },
    "EVENT_CONTEXT": {
        "attributes": {
            "end_time": {
                "description": "Optional end time of the clinical session.",
                "existence": "0..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "health_care_facility": {
                "description": "The health care facility under whose care the event took place. This is the most specific workgroup or delivery unit within a care delivery enterprise that has an official identifier in the health system, and can be used to ensure medico-legal accountability.",
                "existence": "0..1",
                "type": [
                    "PARTY_IDENTIFIED"
                ]
            },
            "location": {
                "description": "The actual location where the session occurred, e.g. 'microbiology lab 2', 'home', 'ward A3'  and so on.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "other_context": {
                "description": "Other optional context which will be archetyped.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "participations": {
                "description": "Parties involved in the healthcare event. These would normally include the physician(s) and often the patient (but not the latter if the clinical session is a pathology test for example).",
                "existence": "0..1",
                "type": [
                    "List",
                    "PARTICIPATION"
                ]
            },
            "setting": {
                "description": "The setting in which the clinical session took place. Coded using the openEHR Terminology,  setting  group.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "start_time": {
                "description": "Start time of the clinical session or other kind of event during which a provider performs a service of any kind for the patient.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Documents the context information of a healthcare event involving the subject of care and the health system. The context information recorded here are independent of the attributes recorded in the version audit, which document the  system interaction  context, i.e. the context of a user interacting with the health record system. Healthcare events include patient contacts, and any other business activity, such as pathology investigations which take place on behalf of the patient.",
        "inherit": "PATHABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_event_context_class"
    },
    "EXTERNAL_ENVIRONMENT_ACCESS": {
        "abstract": "true",
        "description": "A mixin class providing access to services in the external environment.",
        "inherit": "TERMINOLOGY_SERVICE, MEASUREMENT_SERVICE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_external_environment_access_class"
    },
    "EXTRACT": {
        "attributes": {
            "chapters": {
                "description": "The content extracted and serialised from the source repository for this Extract.",
                "existence": "0..1",
                "type": [
                    "List",
                    "EXTRACT_CHAPTER"
                ]
            },
            "participations": {
                "description": "Participations relevant to the creation of this Extract.",
                "existence": "0..1",
                "type": [
                    "List",
                    "EXTRACT_PARTICIPATION"
                ]
            },
            "request_id": {
                "description": "Reference to causing Request, if any.",
                "existence": "0..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "sequence_nr": {
                "description": "Number of this Extract response in sequence of responses to Extract request identified by request_id. If this is the sole response, or there was no request, value is 1.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "specification": {
                "description": "The specification that this Extract actually conforms to; might not be identical with the specification of the corresponding request.",
                "existence": "0..1",
                "type": [
                    "EXTRACT_SPEC"
                ]
            },
            "system_id": {
                "description": "Identifier of creating system.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "time_created": {
                "description": "Creation time of this Extract",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Generic model of an Extract of some information from a repository.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_class"
    },
    "EXTRACT_ACTION_REQUEST": {
        "attributes": {
            "action": {
                "description": "Requested action: cancel | resend | send new. Coded by openEHR Terminology group 'extract action type'.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "request_id": {
                "description": "Identifier of previous EXTRACT_REQUEST.",
                "existence": "1..1",
                "type": [
                    "OBJECT_REF"
                ]
            },
            "uid": {
                "description": "",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            }
        },
        "description": "Generic model of a Request for an Extract, containing an Extract specification.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_action_request_class"
    },
    "EXTRACT_CHAPTER": {
        "attributes": {
            "items": {
                "description": "The information content of this chapter.",
                "existence": "0..1",
                "type": [
                    "List",
                    "EXTRACT_ITEM"
                ]
            }
        },
        "description": "One content chapter of an Extract; contains information relating to only one entity.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_chapter_class"
    },
    "EXTRACT_CONTENT_ITEM": {
        "abstract": "true",
        "attributes": {
            "is_changed": {
                "description": "True if the content item carried in this container is any kind of change since last send, in repeat sending situations.",
                "existence": "0..1",
                "type": [
                    "Boolean"
                ]
            },
            "is_masked": {
                "description": "True if the content of this item has not been included due to insufficient access rights of requestor.",
                "existence": "0..1",
                "type": [
                    "Boolean"
                ]
            },
            "is_primary": {
                "description": "True if the content item carried in this container was part of the primary set for the Extract, i.e. not added due to link-following.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "item": {
                "description": "Content object.",
                "existence": "0..1",
                "type": [
                    "Any"
                ]
            }
        },
        "description": "Abstract model of a wrapper for one content item in an Extract, containing various meta-data. Indicates whether it was part of the primary set and what its original path was. Intended to be subtyped for wrappers of specific types of content.",
        "inherit": "EXTRACT_ITEM",
        "specialization": [
            "OPENEHR_CONTENT_ITEM"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_content_item_class"
    },
    "EXTRACT_ENTITY_CHAPTER": {
        "attributes": {
            "extract_id_key": {
                "description": "Reference to entity, usually a demographic entity such as a patient that the content of this chapter relates to.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Type of chapter that contains information relating to a single demographic entity.",
        "inherit": "EXTRACT_CHAPTER",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_entity_chapter_class"
    },
    "EXTRACT_ENTITY_MANIFEST": {
        "attributes": {
            "ehr_id": {
                "description": "EHR / EMR identifier for the entity at the target system.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "extract_id_key": {
                "description": "Identifier by which this entity is known in the Extract. May be one of the other identifiers, e.g. ehr_id or subject_id, or it may be something else, including a simple integer.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "item_list": {
                "description": "List of Uids of items to be included in the Extract, in cases where individual items are being requested by id. More typically, this attribute is not used, and the EXTRACT_SPEC.criteria query defines the Extract contents. If set, for openEHR data, these are Uids identifying the version containers.",
                "existence": "0..1",
                "type": [
                    "List",
                    "OBJECT_REF"
                ]
            },
            "other_ids": {
                "description": "Other identifiers that may be used to find the entity at the target system, keyed by type. May include medicare numbers, drivers license number, tax number etc.",
                "existence": "0..1",
                "type": [
                    "List",
                    "String"
                ]
            },
            "subject_id": {
                "description": "Subject (i.e. patient or similar) identifier for the entity at the target system.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "The manifest for one entity (e.g. EHR subject), identifying the entity and optionally specifying top-level items to be included in the Extract. The list actually included may be modified by the version_spec part of the specification, and also by the link_depth attribute. In repeat (standing order) requests, the final inclusion may be modified by the send_changes_only value for EXTRACT_UPDATE_SPEC.update_method.\n\n\nVarious identifiers may be provided for the entity; these are to be used by the receiver system to locate the entity. The extract_id_key attribute is used to record the identifier that will be used throughout the Extract for this entity, including in instances of EXTRACT_ENTITY_IDENTIFIER.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_entity_manifest_class"
    },
    "EXTRACT_FOLDER": {
        "attributes": {
            "items": {
                "description": "List of Folders and content items in this Folder.",
                "existence": "0..1",
                "type": [
                    "List",
                    "EXTRACT_ITEM"
                ]
            }
        },
        "description": "Folder in local Folder structure in an Extract. Empty Folders are allowed.",
        "inherit": "EXTRACT_ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_folder_class"
    },
    "EXTRACT_ITEM": {
        "abstract": "true",
        "description": "Abstract parent of Extract Folder and Content types.",
        "inherit": "LOCATABLE",
        "specialization": [
            "EXTRACT_FOLDER",
            "EXTRACT_CONTENT_ITEM"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_item_class"
    },
    "EXTRACT_MANIFEST": {
        "attributes": {
            "entities": {
                "description": "List of entity manifests uids of items included in the Extract; for openEHR data, these are uids identifying the version containers.",
                "existence": "1..1",
                "type": [
                    "List",
                    "EXTRACT_ENTITY_MANIFEST"
                ]
            }
        },
        "description": "Specification of the candidate entities and optionally top-level items (e.g. Compositions) to be included in the Extract.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_manifest_class"
    },
    "EXTRACT_PARTICIPATION": {
        "attributes": {
            "function": {
                "description": "The function of the Party in this participation (note that a given party might participate in more than one way in a particular activity). This attribute should be coded, but cannot be limited to the HL7v3:ParticipationFunction vocabulary, since it is too limited and hospital-oriented.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "mode": {
                "description": "The mode of the performer / activity interaction, e.g. present, by telephone, by email etc.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "performer": {
                "description": "Uid of demographic entity within Extract who performed this participation.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "time": {
                "description": "The time interval during which the participation took place, if it is used in an observational context (i.e. recording facts about the past); or the intended time interval of the participation when used in future contexts, such as EHR Instructions.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Model of a participation of a Party (any Actor or Role) in an activity.  Used to represent any participation of a Party in some activity, which is not  explicitly in the model, e.g. assisting nurse. Can be used to record past or  future participations.\n\n\nShould not be used in place of more permanent relationships between demographic entities.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_participation_class"
    },
    "EXTRACT_REQUEST": {
        "attributes": {
            "extract_spec": {
                "description": "Specification details of the request.",
                "existence": "1..1",
                "type": [
                    "EXTRACT_SPEC"
                ]
            },
            "uid": {
                "description": "Identifier of this Request, generated by requestor.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "update_spec": {
                "description": "Update details of the request.",
                "existence": "0..1",
                "type": [
                    "EXTRACT_UPDATE_SPEC"
                ]
            }
        },
        "description": "Generic model of a Request for an Extract, containing an Extract specification.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_request_class"
    },
    "EXTRACT_SPEC": {
        "attributes": {
            "criteria": {
                "description": "Queries specifying the contents of this Extract.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_PARSABLE"
                ]
            },
            "extract_type": {
                "description": "Coded term indicating the type of content required, e.g.\n\n\n\n\n|openehr-ehr|\n\n\n|openehr-demographic|\n\n\n|generic-emr|\n\n\n|other|\n\n\n\n\nCoded by openEHR Terminology group 'extract content type'.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "include_multimedia": {
                "description": "Indicates whether in-line instances of DV_MULTIMEDIA in the source data are included or not.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "link_depth": {
                "description": "Degree of links to follow emanating from content items specified for inclusion. The kind of links to follow is dependent on the type of Extract.\n\n\nAll items at the target end of followed links at the given depth are also included in the extract; EXTRACT_CONTENT_ITEM.is_primary is used to differentiate.\n\n\n\n\n0 = don\u2019t follow;\n\n\n1 = follow first degree links;\n\n\n2 = follow 2nd degree links;\n\n\n\u2026\u200b.\n\n\nn = follow nth degree links",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "manifest": {
                "description": "Specification of entities (e.g. records) to include in the Extract.",
                "existence": "1..1",
                "type": [
                    "EXTRACT_MANIFEST"
                ]
            },
            "other_details": {
                "description": "Other specification items. Archetypable.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "priority": {
                "description": "Requested priority of this request to be handled by server. Priority schemes are likely to be local, and use values agreed by both ends.\n\n\nTBD: alternative is standard coded terms",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "version_spec": {
                "description": "Specification of which versions of information items to include in the Extract. If Void, the default is latest versions only (which is reasonable for non-versioning systems as well).",
                "existence": "0..1",
                "type": [
                    "EXTRACT_VERSION_SPEC"
                ]
            }
        },
        "description": "Specification of an Extract\u2019s contents. Subtypes can be used to add details specific to the type of Extract. The specification consists of attributes specifying the directory, and two further groups of attributes in their own classes, namely a version specfication (which versions of information items are to be included) and a manifest (which entities are to be included in the extract).\n\n\nUse: Used in a request to specify an Extract, as well as to describe what is contained in an Extract.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_spec_class"
    },
    "EXTRACT_UPDATE_SPEC": {
        "attributes": {
            "persist_in_server": {
                "description": "If True, this Request is persisted in the server until further notice.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "repeat_period": {
                "description": "Period for resending update Extracts in response to original Request.",
                "existence": "0..1",
                "type": [
                    "DV_DURATION"
                ]
            },
            "trigger_events": {
                "description": "Set of Event names that will cause sending of update Extracts. Event types include:\n\n\n\n\n|any_change| - any change in content items matched by content specification, e.g. new versions of persistent compositions. If the content list allows matching of any, or a wide range of archetypes, this event type will match any additions to the record.\n\n\n|correction| - match error corrections only, including deletions.\n\n\n|update| - match updates (i.e. new versions) of included content items.\n\n\n\n\nCoded by openEHR Terminology group 'extract update trigger event type'.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_CODED_TEXT"
                ]
            },
            "update_method": {
                "description": "Indicate mode of update. Can be: send only items that are changed (including logical deletions) or new since last send. For persist_in_server Requests only.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            }
        },
        "description": "Specification of the how the request should be processed by server. The request can be persisted in the server, meaning that a) it can be re-activated by the requesting system simply by indicating Request id, and b) that a changes-only pattern of Extract updates can be set up. To achieve this, the server has to remember what was sent in the previous response.\n\n\nThe update mode may be event-driven and periodic update or a mixture of both. The candidate items to be sent each time are the result of re-evaluating the content and versioning parts of the specification; what is actually sent is determined by the send_changes_only flag.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_update_spec_class"
    },
    "EXTRACT_VERSION_SPEC": {
        "attributes": {
            "commit_time_interval": {
                "description": "Specifies commit time interval of items to source repository to include in Extract. By default, only latest versions whose commit times fall in the range are included. If include_all_versions is True, then the range includes all versions committed within the interval.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE_TIME"
                ]
            },
            "include_all_versions": {
                "description": "True if all versions of each item in the Extract are included.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "include_data": {
                "description": "True if the data of items matched by the content spec should be included. This is the default. If False, only revision history is included in serialised versions. Turning this option on in openEHR systems causes X_VERSIONED_OBJECTs to have revision_history set, but versions Void. Useful for interrogating a server without having to look at any content data. In other systems it may or may not have a sensible meaning.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            },
            "include_revision_history": {
                "description": "True if revision histories of the items in the Extract are included. If included, it is always the full revision history.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            }
        },
        "description": "Specification of what versions should be included in an Extract. By default, only latest versions are included in the Extract, in which case this part of the Extract specification is not needed at all. The attributes include_all_versions and commit_time_interval are used to modify this; the former forces all versions to be included; the latter limits the versions to be those latest versions committed in the time interval, or if include_all_versions is True, all versions committed in the time interval.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_extract_version_spec_class"
    },
    "Env": {
        "description": "Class representing the real-world environment, providing basic information like current time, date, etc.",
        "functions": {
            "current_date ()": {
                "description": "Return today\u2019s date in the current locale.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Iso8601_date"
                ]
            },
            "current_date_time ()": {
                "description": "Return current date/time in the current locale.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Iso8601_date_time"
                ]
            },
            "current_time ()": {
                "description": "Return current time in the current locale.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Iso8601_time"
                ]
            },
            "current_time_zone ()": {
                "description": "Return the timezone of the current locale.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Iso8601_timezone"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_env_interface"
    },
    "FEEDER_AUDIT": {
        "attributes": {
            "feeder_system_audit": {
                "description": "Any audit information for the information item from the feeder system, if different from the originating system.",
                "existence": "0..1",
                "type": [
                    "FEEDER_AUDIT_DETAILS"
                ]
            },
            "feeder_system_item_ids": {
                "description": "Identifiers used for the item in the feeder system, where the feeder system is distinct from the originating system.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_IDENTIFIER"
                ]
            },
            "original_content": {
                "description": "Optional inline inclusion of or reference to original content corresponding to the openEHR content at this node. Typically a URI reference to a document or message in a persistent store associated with the EHR.",
                "existence": "0..1",
                "type": [
                    "DV_ENCAPSULATED"
                ]
            },
            "originating_system_audit": {
                "description": "Any audit information for the information item from the originating system.",
                "existence": "1..1",
                "type": [
                    "FEEDER_AUDIT_DETAILS"
                ]
            },
            "originating_system_item_ids": {
                "description": "Identifiers used for the item in the originating system, e.g. filler and placer ids.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_IDENTIFIER"
                ]
            }
        },
        "description": "The FEEDER_AUDIT class defines the semantics of an audit trail which is constructed to describe the origin of data that have been transformed into openEHR form and committed to the system.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_feeder_audit_class"
    },
    "FEEDER_AUDIT_DETAILS": {
        "attributes": {
            "location": {
                "description": "Identifier of the particular site/facility within an organisation which handled the item. For computability, this identifier needs to be e.g. a PKI identifier which can be included in the identifier list of the PARTY_IDENTIFIED object.",
                "existence": "0..1",
                "type": [
                    "PARTY_IDENTIFIED"
                ]
            },
            "other_details": {
                "description": "Optional attribute to carry any custom meta-data. May be archetyped.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "provider": {
                "description": "Optional provider(s) who created, committed, forwarded or otherwise handled the item.",
                "existence": "0..1",
                "type": [
                    "PARTY_IDENTIFIED"
                ]
            },
            "subject": {
                "description": "Identifiers for subject of the received information item.",
                "existence": "0..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "system_id": {
                "description": "Identifier of the system which handled the information item. This is the IT system owned by the organisation legally responsible for handling the data, and at which the data were previously created or passed by an earlier system.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "time": {
                "description": "Time of handling the item. For an originating system, this will be time of creation, for an intermediate feeder system, this will be a time of accession or other time of handling, where available.",
                "existence": "0..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "version_id": {
                "description": "Any identifier used in the system such as  \"interim\" ,  \"final\" , or numeric versions if available.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Audit details for any system in a feeder system chain. Audit details here means the general notion of who/where/when the information item to which the audit is attached was created. None of the attributes is defined as mandatory, however, in different scenarios, various combinations of attributes will usually be mandatory. This can be controlled by specifying feeder audit details in legacy archetypes.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_feeder_audit_details_class"
    },
    "FOLDER": {
        "attributes": {
            "details": {
                "description": "Archetypable meta-data for FOLDER.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "folders": {
                "description": "Sub-folders of this FOLDER.",
                "existence": "0..1",
                "type": [
                    "List",
                    "FOLDER"
                ]
            },
            "items": {
                "description": "The list of references to other (usually) versioned objects logically in this folder.",
                "existence": "0..1",
                "type": [
                    "List",
                    "OBJECT_REF"
                ]
            }
        },
        "description": "The concept of a named folder.\n\n\n\n\n\nNote\n\n\nIt is strongly recommended that the inherited attribute uid be populated in top-level (i.e. tree-root) FOLDER objects, using the UID copied from the object_id() of the uid field of the enclosing VERSION object.\nFor example, the ORIGINAL_VERSION.uid 87284370-2D4B-4e3d-A3F3-F303D2F4F34B::uk.nhs.ehr1::2  would be copied to the uid field of the top FOLDER object.",
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_folder_class"
    },
    "GENERIC_CONTENT_ITEM": {
        "attributes": {
            "author": {
                "description": "Reference to a demographic entity elsewhere in this Extract representing the author of the item version. The reference should be a UID corresponding to the UID of a GENERIC_CONTENT_ITEM containing the demographic information.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "authorisation_time": {
                "description": "Time of authorisation of this item version on the original system where relevant.",
                "existence": "0..1",
                "type": [
                    "Iso8601_date_time"
                ]
            },
            "authoriser": {
                "description": "Reference to a demographic entity elsewhere in this Extract representing an authoriser of the item version, if relevant. The reference should be a UID corresponding to the UID of a GENERIC_CONTENT_ITEM containing the demographic information.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "creation_time": {
                "description": "Time of creation of this item version on the original system. This may be an earlier commit time, or it may be the time at which the item was created during the Extract generation process.",
                "existence": "0..1",
                "type": [
                    "Iso8601_date_time"
                ]
            },
            "item": {
                "description": "Content object.",
                "existence": "0..1",
                "type": [
                    "LOCATABLE"
                ]
            },
            "item_status": {
                "description": "Coded lifecycle status of the item.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "item_type": {
                "description": "Identifier of model or schema used to create the content.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "item_type_version": {
                "description": "Version of model or schema used to create the content item.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "other_details": {
                "description": "Other details about the content item.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "system_id": {
                "description": "Identifier of EMR or other system from which the item was created / extracted. Typically in the form of a domain name.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "version_id": {
                "description": "Version id of this item in original system.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "version_set_id": {
                "description": "Version set id of this item in original system, where applicable.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Single item in generic extract, designed for 13606 and CDA data.",
        "inherit": "EXTRACT_CONTENT_ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_generic_content_item_class"
    },
    "GENERIC_ENTRY": {
        "attributes": {
            "data": {
                "description": "The \u2018data\u2019 from the source message or record.",
                "existence": "1..1",
                "type": [
                    "ITEM_TREE"
                ]
            }
        },
        "description": "This class is used to create intermediate representations of data from sources not otherwise conforming to openEHR classes, such as HL7 messages, relational databases and so on.",
        "inherit": "CONTENT_ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/integration.html#_generic_entry_class"
    },
    "GENERIC_ID": {
        "attributes": {
            "scheme": {
                "description": "Name of the scheme to which this identifier conforms. Ideally this name will be recognisable globally but realistically it may be a local ad hoc scheme whose name is not controlled or standardised in any way.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Generic identifier type for identifiers whose format is otherwise unknown to openEHR. Includes an attribute for naming the identification scheme (which may well be local).",
        "inherit": "OBJECT_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_generic_id_class"
    },
    "GROUP": {
        "description": "A group is a real world group of parties which is created by another party, usually an organisation, for some specific purpose. A typical clinical example is that of the specialist care team, e.g.  cardiology team . The members of the group usually work together.",
        "inherit": "ACTOR",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_group_class"
    },
    "HIER_OBJECT_ID": {
        "description": "Concrete type corresponding to hierarchical identifiers of the form defined by UID_BASED_ID.",
        "inherit": "UID_BASED_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_hier_object_id_class"
    },
    "HISTORY<T>": {
        "attributes": {
            "duration": {
                "description": "Duration of the entire History; either corresponds to the duration of all the events, and/or the duration represented by the summary, if it exists.",
                "existence": "0..1",
                "type": [
                    "DV_DURATION"
                ]
            },
            "events": {
                "description": "The events in the series. This attribute is of a generic type whose parameter must be a descendant of ITEM_SUTRUCTURE.",
                "existence": "0..1",
                "type": [
                    "List",
                    "EVENT"
                ]
            },
            "origin": {
                "description": "Time origin of this event history. The first event is not necessarily at the origin point.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "period": {
                "description": "Period between samples in this segment if periodic.",
                "existence": "0..1",
                "type": [
                    "DV_DURATION"
                ]
            },
            "summary": {
                "description": "Optional summary data that aggregates, organizes, reduces and transforms the event series. This may be a text or image that presents a graphical presentation, or some data that assists with the interpretation of the data.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Root object of a linear history, i.e. time series structure. This is a generic class whose type parameter must be a descendant of ITEM_STRUCTURE, ensuring that each Event in the events of a given instance is of the same structural type, i.e. ITEM_TREE, ITEM_LIST etc.\n\n\nFor a periodic series of events, period will be set, and the time of each Event in the History must correspond; i.e. the EVENT.offset must be a multiple of period for each Event. Missing events in a period History are however allowed.",
        "functions": {
            "is_periodic ()": {
                "description": "Indicates whether history is periodic.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "DATA_STRUCTURE",
        "type": "Class"
    },
    "IMPORTED_VERSION<T>": {
        "attributes": {
            "item": {
                "description": "The ORIGINAL_VERSION object that was imported.",
                "existence": "1..1",
                "type": [
                    "ORIGINAL_VERSION"
                ]
            }
        },
        "description": "Versions whose content is an ORIGINAL_VERSION copied from another location; this class inherits commit_audit and contribution from VERSION<T>, providing imported versions with their own audit trail and Contribution, distinct from those of the imported ORIGINAL_VERSION.",
        "functions": {
            "data ()": {
                "description": "Original content of this Version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "T"
                ]
            },
            "lifecycle_state ()": {
                "description": "Lifecycle state of the content item in wrapped ORIGINAL_VERSION, derived as item.lifecycle_state; coded by openEHR vocabulary version lifecycle state.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_CODED_TEXT"
                ]
            },
            "preceding_version_uid ()": {
                "description": "Computed version of inheritance precursor, derived as item.preceding_version_uid.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "OBJECT_VERSION_ID"
                ]
            },
            "uid ()": {
                "description": "Computed version of inheritance precursor, derived as item.uid.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "OBJECT_VERSION_ID"
                ]
            }
        },
        "inherit": "VERSION",
        "type": "Class"
    },
    "INSTRUCTION": {
        "attributes": {
            "activities": {
                "description": "List of all activities in Instruction.",
                "existence": "0..1",
                "type": [
                    "List",
                    "ACTIVITY"
                ]
            },
            "expiry_time": {
                "description": "Optional expiry date/time to assist determination of when an Instruction can be assumed to have expired. This helps prevent false listing of Instructions as Active when they clearly must have been terminated in some way or other.",
                "existence": "0..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "narrative": {
                "description": "Mandatory human-readable version of what the Instruction is about.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "wf_definition": {
                "description": "Optional workflow engine executable expression of the Instruction.",
                "existence": "0..1",
                "type": [
                    "DV_PARSABLE"
                ]
            }
        },
        "description": "Used to specify actions in the future. Enables simple and complex specifications to be expressed, including in a fully-computable workflow form. Used for any actionable statement such as medication and therapeutic orders, monitoring, recall and review. Enough details must be provided for the specification to be directly executed by an actor, either human or machine.\n\n\nNot to be used for plan items which are only specified in general terms.",
        "inherit": "CARE_ENTRY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_instruction_class"
    },
    "INSTRUCTION_DETAILS": {
        "attributes": {
            "activity_id": {
                "description": "Identifier of Activity within Instruction, in the form of its archetype path.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "instruction_id": {
                "description": "Reference to causing Instruction.",
                "existence": "1..1",
                "type": [
                    "LOCATABLE_REF"
                ]
            },
            "wf_details": {
                "description": "Various workflow engine state details, potentially including such things as:\n\n\n\n\ncondition that fired to cause this Action to be done (with actual variables substituted);\n\n\nlist of notifications which actually occurred (with all variables substituted);\n\n\nother workflow engine state.\n\n\n\n\nThis specification does not currently define the actual structure or semantics of this field.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Used to record details of the Instruction causing an Action.",
        "inherit": "PATHABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_instruction_details_class"
    },
    "INTERNET_ID": {
        "description": "Model of a reverse internet domain, as used to uniquely identify an internet domain. In the form of a dot-separated string in the reverse order of a domain name, specified by IETF RFC 1034.",
        "inherit": "UID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_internet_id_class"
    },
    "INTERVAL_EVENT<T>": {
        "attributes": {
            "math_function": {
                "description": "Mathematical function of the data of this event, e.g.  maximum, mean etc. Coded using openEHR vocabulary event math function. Default value 640|actual|, meaning 'actual value'.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "sample_count": {
                "description": "Optional count of original samples to which this event corresponds.",
                "existence": "0..1",
                "type": [
                    "Integer"
                ]
            },
            "width": {
                "description": "Duration of the time interval during which the values recorded under data are true and, if set, the values recorded under state are true. Void if an instantaneous event.",
                "existence": "1..1",
                "type": [
                    "DV_DURATION"
                ]
            }
        },
        "description": "Defines a single interval event in a series.",
        "functions": {
            "interval_start_time ()": {
                "description": "Start time of the interval of this event.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_DATE_TIME"
                ]
            }
        },
        "inherit": "EVENT",
        "type": "Class"
    },
    "ISM_TRANSITION": {
        "attributes": {
            "careflow_step": {
                "description": "The step in the careflow process which occurred as part of generating this action, e.g.  dispense ,  start_administration. This attribute represents the clinical  label for the activity, as  opposed to current_state which represents  the state machine (ISM)  computable form. Defined in archetype.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "current_state": {
                "description": "The ISM current state. Coded by openEHR terminology group Instruction states.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "reason": {
                "description": "Optional possibility of adding one or more reasons for this careflow step having been taken. Multiple reasons may occur in medication management for example.",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_TEXT"
                ]
            },
            "transition": {
                "description": "The ISM transition which occurred to arrive in the current_state. Coded by openEHR terminology group  Instruction transitions.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            }
        },
        "description": "Model of a transition in the Instruction State Machine, caused by a careflow step. The attributes document the careflow step as well as the ISM transition.",
        "inherit": "PATHABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_ism_transition_class"
    },
    "ISO_OID": {
        "description": "Model of ISO\u2019s Object Identifier (oid) as defined by the standard ISO/IEC 8824. Oids are formed from integers separated by dots. Each non-leaf node in an Oid starting from the left corresponds to an assigning authority, and identifies that authority\u2019s namespace, inside which the remaining part of the identifier is locally unique.",
        "inherit": "UID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_iso_oid_class"
    },
    "ITEM": {
        "abstract": "true",
        "description": "The abstract parent of CLUSTER and ELEMENT representation classes.",
        "inherit": "LOCATABLE",
        "specialization": [
            "CLUSTER",
            "ELEMENT"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_class"
    },
    "ITEM_LIST": {
        "attributes": {
            "items": {
                "description": "Physical representation of the list.",
                "existence": "0..1",
                "type": [
                    "List",
                    "ELEMENT"
                ]
            }
        },
        "description": "Logical list data structure, where each item has a value and can be referred to by a name and a positional index in the list. The list may be empty.\n\n\nITEM_LIST is used to represent any data which is logically a list of values, such as blood pressure, most protocols, many blood tests etc.\n\n\nNot to be used for time-based lists, which should be represented with the proper temporal class, i.e. HISTORY.",
        "functions": {
            "as_hierarchy ()": {
                "description": "Generate a CEN EN13606-compatible hierarchy consisting of a single CLUSTER containing the ELEMENTs of this list.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            },
            "item_count ()": {
                "description": "Count of all items.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            },
            "ith_item (i: Integer[1])": {
                "description": "Retrieve the i-th item with name.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ELEMENT"
                ]
            },
            "named_item (a_name: String[1])": {
                "description": "Retrieve the item with name \u2018a_name\u2019.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ELEMENT"
                ]
            },
            "names ()": {
                "description": "Retrieve the names of all items.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "ITEM_STRUCTURE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_list_class"
    },
    "ITEM_SINGLE": {
        "attributes": {
            "item": {
                "description": "",
                "existence": "1..1",
                "type": [
                    "ELEMENT"
                ]
            }
        },
        "description": "Logical single value data structure. Used to represent any data which is logically a single value, such as a person\u2019s height or weight.",
        "functions": {
            "as_hierarchy ()": {
                "description": "Generate a CEN EN13606-compatible hierarchy consisting of a single ELEMENT.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ELEMENT"
                ]
            }
        },
        "inherit": "ITEM_STRUCTURE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_single_class"
    },
    "ITEM_STRUCTURE": {
        "abstract": "true",
        "description": "Abstract parent class of all spatial data types.",
        "inherit": "DATA_STRUCTURE",
        "specialization": [
            "ITEM_SINGLE",
            "ITEM_LIST",
            "ITEM_TABLE",
            "ITEM_TREE"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_structure_class"
    },
    "ITEM_TABLE": {
        "attributes": {
            "rows": {
                "description": "Physical representation of the table as a list of CLUSTERs, each containing the data of one row of the table.",
                "existence": "0..1",
                "type": [
                    "List",
                    "CLUSTER"
                ]
            }
        },
        "description": "Logical relational database style table data structure, in which columns are named and ordered with respect to each other. Implemented using Cluster-per-row encoding. Each row Cluster must have an identical number of Elements, each of which in turn must have identical names and value types in the corresponding positions in each row.\n\n\nSome columns may be designated  key' columns, containing key data for each row, in the manner of relational tables. This allows row-naming, where each row represents a body site, a blood antigen etc. All values in a column have the same data type.\n\n\nUsed for representing any data which is logically a table of values, such as blood pressure, most protocols, many blood tests etc.\n\n\nMisuse: Not to be used for time-based data, which should be represented with the temporal class HISTORY. The table may be empty.",
        "functions": {
            "as_hierarchy ()": {
                "description": "Generate a CEN EN13606-compatible hierarchy consisting of a single CLUSTER containing the CLUSTERs representing the columns of this table.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            },
            "column_count ()": {
                "description": "Return number of columns in the table.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            },
            "column_names ()": {
                "description": "Return set of column names.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "DV_TEXT"
                ]
            },
            "element_at_cell_ij (i: Integer[1],j: Integer[1])": {
                "description": "Return cell at a particular location.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ELEMENT"
                ]
            },
            "has_column_with_name (a_key: String[1])": {
                "description": "Return True if there is a column with name = a_key.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "has_row_with_key (keys: List<String>[0..1])": {
                "description": "Return True if there is a row with key keys.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "has_row_with_name (a_key: String[1])": {
                "description": "Return True if there is a column with name = a_key.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "ith_row (i: Integer[1])": {
                "description": "Return i-th row.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            },
            "named_row (a_key: String[1])": {
                "description": "Return row with name = a_key.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            },
            "row_count ()": {
                "description": "Number of rows in the table.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            },
            "row_names ()": {
                "description": "Return set of row names.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "DV_TEXT"
                ]
            },
            "row_with_key (keys: List<String>[0..1])": {
                "description": "Return rows with particular keys.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            }
        },
        "inherit": "ITEM_STRUCTURE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_table_class"
    },
    "ITEM_TREE": {
        "attributes": {
            "items": {
                "description": "The items comprising the ITEM_TREE. Can include 0 or more CLUSTERs and/or 0 or more individual ELEMENTs.",
                "existence": "0..1",
                "type": [
                    "List",
                    "ITEM"
                ]
            }
        },
        "description": "Logical tree data structure. The tree may be empty. Used for representing data which are logically a tree such as audiology results, microbiology results, biochemistry results.",
        "functions": {
            "as_hierarchy ()": {
                "description": "Generate a CEN EN13606-compatible hierarchy, which is the same as the tree\u2019s physical representation.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CLUSTER"
                ]
            },
            "element_at_path (a_path: String[1])": {
                "description": "Return the leaf element at the path  a_path'.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "ELEMENT"
                ]
            },
            "has_element_path (a_path: String[1])": {
                "description": "True if path  a_path' is a valid leaf path.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "ITEM_STRUCTURE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_structures.html#_item_tree_class"
    },
    "LINK": {
        "attributes": {
            "meaning": {
                "description": "Used to describe the relationship, usually in clinical terms, such as  in response to  (the relationship between test results and an order),  follow-up to  and so on. Such relationships can represent any clinically meaningful connection between pieces of information. Values for meaning include those described in Annex C, ENV 13606 pt 2 under the categories of  generic ,  documenting and reporting ,  organisational ,  clinical ,  circumstancial , and  view management .",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "target": {
                "description": "The logical  to  object in the link relation, as per the linguistic sense of the meaning attribute.",
                "existence": "1..1",
                "type": [
                    "DV_EHR_URI"
                ]
            },
            "type": {
                "description": "The type attribute is used to indicate a clinical or domain-level meaning for the kind of link, for example  problem  or  issue . If type values are designed appropriately, they can be used by the requestor of EHR extracts to categorise links which must be followed and which can be broken when the extract is created.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            }
        },
        "description": "The LINK type defines a logical relationship between two items, such as two ENTRYs or an ENTRY and a COMPOSITION. Links can be used across compositions, and across EHRs. Links can potentially be used between interior (i.e. non archetype root) nodes, although this probably should be prevented in archetypes. Multiple LINKs can be attached to the root object of any archetyped structure to give the effect of a 1\u2192N link.\n\n\n1:1 and 1:N relationships between archetyped content elements (e.g. ENTRYs) can be expressed by using one, or more than one, respectively, LINKs. Chains of links can be used to see  problem threads  or other logical groupings of items.\n\n\nLinks should be between archetyped structures only, i.e. between objects representing complete domain concepts because relationships between sub-elements of whole concepts are not necessarily meaningful, and may be downright confusing. Sensible links only exist between whole ENTRYs, SECTIONs, COMPOSITIONs and so on.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_link_class"
    },
    "LOCATABLE": {
        "abstract": "true",
        "attributes": {
            "archetype_details": {
                "description": "Details of archetyping used on this node.",
                "existence": "0..1",
                "type": [
                    "ARCHETYPED"
                ]
            },
            "archetype_node_id": {
                "description": "Design-time archetype identifier of this node taken from its generating archetype; used to build archetype paths. Always in the form of an at-code, e.g.  at0005. This value enables a 'standardised' name for this node to be generated, by referring to the generating archetype local terminology.\n\n\nAt an archetype root point, the value of this attribute is always the stringified form of the archetype_id found in the archetype_details object.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "feeder_audit": {
                "description": "Audit trail from non-openEHR system of original commit of information forming the content of this node, or from a conversion gateway which has synthesised this node.",
                "existence": "0..1",
                "type": [
                    "FEEDER_AUDIT"
                ]
            },
            "links": {
                "description": "Links to other archetyped structures (data whose root object inherits from ARCHETYPED, such as ENTRY, SECTION and so on). Links may be to structures in other compositions.",
                "existence": "0..1",
                "type": [
                    "List",
                    "LINK"
                ]
            },
            "name": {
                "description": "Runtime name of this fragment, used to build runtime paths. This is the term provided via a clinical application or batch process to name this EHR construct: its retention in the EHR faithfully preserves the original label by which this entry was known to end users.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "uid": {
                "description": "Optional globally unique object identifier for root points of archetyped structures.",
                "existence": "0..1",
                "type": [
                    "UID_BASED_ID"
                ]
            }
        },
        "description": "Root class of all information model classes that can be archetyped. Most classes in the openEHR reference model inherit from the LOCATABLE class, which defines the idea of  locatability in an archetyped structure. LOCATABLE defines a runtime name and an archetype_node_id.",
        "functions": {
            "concept ()": {
                "description": "Clinical concept of the archetype as a whole (= derived from the archetype_node_id' of the root node)",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            },
            "is_archetype_root ()": {
                "description": "True if this node is the root of an archetyped structure.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "PATHABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_locatable_class"
    },
    "LOCATABLE_REF": {
        "attributes": {
            "id": {
                "description": "Globally unique id of an object, regardless of where it is stored.",
                "existence": "1..1",
                "type": [
                    "UID_BASED_ID"
                ]
            },
            "path": {
                "description": "The path to an instance in question, as an absolute path with respect to the object found at VERSION.data. An empty path means that the object referred to by id being specified.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Purpose Reference to a LOCATABLE instance inside the top-level content structure inside a VERSION<T>; the path attribute is applied to the object that VERSION.data points to.",
        "functions": {
            "as_uri ()": {
                "description": "A URI form of the reference, created by concatenating the following:\n\n\n\n\nscheme, e.g. ehr:, derived from namespace\n\n\nid.value\n\n\n/ + path, where path is non-empty",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "inherit": "OBJECT_REF",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_locatable_ref_class"
    },
    "Locale": {
        "description": "Class representing current Locale.",
        "functions": {
            "primary_language ()": {
                "description": "Primary language of the current locale.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Terminology_code"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_locale_interface"
    },
    "MEASUREMENT_SERVICE": {
        "description": "Defines an object providing proxy access to a measurement information service.",
        "functions": {
            "is_valid_units_string (units: String[1])": {
                "description": "True if the units string  units' is a valid string according to the HL7 UCUM specification.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "units_equivalent (units1: String[1],units2: String[1])": {
                "description": "True if two units strings correspond to the same measured property.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_measurement_service_class"
    },
    "MESSAGE": {
        "attributes": {
            "audit": {
                "description": "Details of who actually created the message and when. This is the person who entered the data or otherwise caused the message to be created, or might be a piece of software.",
                "existence": "1..1",
                "type": [
                    "AUDIT_DETAILS"
                ]
            },
            "content": {
                "description": "Content of the message.",
                "existence": "1..1",
                "type": [
                    "MESSAGE_CONTENT"
                ]
            },
            "signature": {
                "description": "Optional signature by the author of message content in openPGP format. The signature is created as a Hash and optional signing of the serialisation of this message object with this signature field Void.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "A \u201cmessage\u201d is an authored, possibly signed, piece of content intended for one or more recipients. Since the recipient may or may not be known directly, recipients are specified in the ADDRESSED_MESSAGE class.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_message_class"
    },
    "Math": {
        "description": "Mathematical computation.",
        "functions": {
            "ln (v: Numeric[1])": {
                "description": "Compute natural log of v.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "log (v: Numeric[1])": {
                "description": "Compute base 10 log of v.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "sin ((v: Numeric[1])": {
                "description": "Compute sin(v).",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_math_interface"
    },
    "OBJECT_ID": {
        "abstract": "true",
        "attributes": {
            "value": {
                "description": "The value of the id in the form defined below.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Ancestor class of identifiers of informational objects. Ids may be completely meaningless, in which case their only job is to refer to something, or may carry some information to do with the identified object.\n\n\nObject ids are used inside an object to identify that object. To identify another object in another service, use an OBJECT_REF, or else use a UID for local objects identified by UID. If none of the subtypes is suitable, direct instances of this class may be used.",
        "specialization": [
            "UID_BASED_ID"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_object_id_class"
    },
    "OBJECT_REF": {
        "attributes": {
            "id": {
                "description": "Globally unique id of an object, regardless of where it is stored.",
                "existence": "1..1",
                "type": [
                    "OBJECT_ID"
                ]
            },
            "namespace": {
                "description": "Namespace to which this identifier belongs in the local system context (and possibly in any other openEHR compliant environment) e.g.  terminology ,  demographic . These names are not yet standardised. Legal values for namespace are:\n\n\n\n\n\"local\"\n\n\n\"unknown\"\n\n\na string matching the standard regex [a-zA-Z][a-zA-Z0-9_.:\\/&?=+-]*.\n\n\n\n\nNote that the first two are just special values of the regex, and will be matched by it.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "type": {
                "description": "Name of the  class (concrete or abstract) of object to which this identifier type refers, e.g. PARTY, PERSON,  GUIDELINE  etc. These class names are from the relevant reference model. The type name ANY can be used to indicate that any type is accepted (e.g. if the type is unknown).",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Class describing a reference to another object, which may exist locally or be maintained outside the current namespace, e.g. in another service. Services are usually external, e.g. available in a LAN (including on the same host) or the internet via Corba, SOAP, or some other distributed protocol. However, in small systems they may be part of the same executable as the data containing the Id.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_object_ref_class"
    },
    "OBJECT_VERSION_ID": {
        "description": "Globally unique identifier for one version of a versioned object; lexical form: object_id  '::' creating_system_id  '::' version_tree_id.",
        "functions": {
            "creating_system_id ()": {
                "description": "Identifier of the system that created the Version corresponding to this Object version id.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "UID"
                ]
            },
            "is_branch ()": {
                "description": "True if this version identifier represents a branch.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "object_id ()": {
                "description": "Unique identifier for logical object of which this identifier identifies one version; normally the object_id will be the unique identifier of the version container containing the version referred to by this OBJECT_VERSION_ID instance.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "UID"
                ]
            },
            "version_tree_id ()": {
                "description": "Tree identifier of this version with respect to other versions in the same version tree, as either 1 or 3 part dot-separated numbers, e.g.  1 ,  2.1.4 .",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "VERSION_TREE_ID"
                ]
            }
        },
        "inherit": "UID_BASED_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_object_version_id_class"
    },
    "OBSERVATION": {
        "attributes": {
            "data": {
                "description": "The data of this observation, in the form of a history of values which may be of any complexity.",
                "existence": "1..1",
                "type": [
                    "HISTORY",
                    "ITEM_STRUCTURE"
                ]
            },
            "state": {
                "description": "Optional recording of the state of subject of this observation during the observation process, in the form of a separate history of values which may be of any complexity. State may also be recorded within the History of the data attribute.",
                "existence": "0..1",
                "type": [
                    "HISTORY",
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "Entry subtype for all clinical data in the past or present, i.e. which (by the time it is recorded) has already occurred. OBSERVATION data is expressed using the class HISTORY<T>, which guarantees that it is situated in time. OBSERVATION is used for all notionally objective (i.e. measured in some way) observations of phenomena, and patient-reported phenomena, e.g. pain.\n\n\nNot to be used for recording opinion or future statements of any kind, including instructions, intentions, plans etc.",
        "inherit": "CARE_ENTRY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_observation_class"
    },
    "OPENEHR_CODE_SET_IDENTIFIERS": {
        "description": "List of identifiers for code sets in the openEHR terminology.",
        "functions": {
            "valid_code_set_id (an_id: String[1])": {
                "description": "Validity function to test if an identifier is in the set defined by this class.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_openehr_code_set_identifiers_class"
    },
    "OPENEHR_CONTENT_ITEM": {
        "attributes": {
            "item": {
                "description": "Content object.",
                "existence": "0..1",
                "type": [
                    "X_VERSIONED_OBJECT"
                ]
            }
        },
        "description": "Form of EHR EXTRACT_ITEM containing openEHR serialised VERSIONED_OBJECTs.",
        "inherit": "EXTRACT_CONTENT_ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_openehr_content_item_class"
    },
    "OPENEHR_DEFINITIONS": {
        "attributes": {
            "Local_terminology_id": {
                "description": "Predefined terminology identifier to indicate it is local to the knowledge resource in which it occurs, e.g. an archetype",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Inheritance class to provide access to constants defined in other packages.",
        "inherit": "BASIC_DEFINITIONS",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_openehr_definitions_class"
    },
    "OPENEHR_TERMINOLOGY_GROUP_IDENTIFIERS": {
        "description": "List of identifiers for groups in the openEHR terminology.",
        "functions": {
            "valid_terminology_group_id (an_id: Boolean[1])": {
                "description": "Validity function to test if an identifier is in the set defined by this class.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_openehr_terminology_group_identifiers_class"
    },
    "ORGANISATION": {
        "description": "Generic description of organisations. An organisation is a legally constituted body whose existence (in general) outlives the existence of parties considered to be part of it.",
        "inherit": "ACTOR",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_organisation_class"
    },
    "ORIGINAL_VERSION<T>": {
        "attributes": {
            "attestations": {
                "description": "Set of attestations relating to this version.",
                "existence": "0..1",
                "type": [
                    "List",
                    "ATTESTATION"
                ]
            },
            "data": {
                "description": "Data content of this Version.",
                "existence": "0..1",
                "type": [
                    "T"
                ]
            },
            "lifecycle_state": {
                "description": "Lifecycle state of the content item in this version; coded by openEHR vocabulary version lifecycle state.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "other_input_version_uids": {
                "description": "Identifiers of other versions whose content was merged into this version, if any.",
                "existence": "0..1",
                "type": [
                    "List",
                    "OBJECT_VERSION_ID"
                ]
            },
            "preceding_version_uid": {
                "description": "Stored version of inheritance precursor.",
                "existence": "0..1",
                "type": [
                    "OBJECT_VERSION_ID"
                ]
            },
            "uid": {
                "description": "Stored version of inheritance precursor.",
                "existence": "1..1",
                "type": [
                    "OBJECT_VERSION_ID"
                ]
            }
        },
        "description": "A Version containing locally created content and optional attestations.",
        "functions": {
            "is_merged ()": {
                "description": "True if this Version was created from more than just the preceding (checked out) version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "VERSION",
        "type": "Class"
    },
    "PARTICIPATION": {
        "attributes": {
            "function": {
                "description": "The function of the Party in this participation (note that a given party might participate in more than one way in a particular activity). This attribute should be coded, but cannot be limited to the HL7v3:ParticipationFunction vocabulary, since it is too limited and hospital-oriented.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "mode": {
                "description": "Optional field for recording the 'mode' of the performer / activity interaction, e.g. present, by telephone, by email etc.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "performer": {
                "description": "The id and possibly demographic system link of the party participating in the activity.",
                "existence": "1..1",
                "type": [
                    "PARTY_PROXY"
                ]
            },
            "time": {
                "description": "The time interval during which the participation took place, if it is used in an observational context (i.e. recording facts about the past); or the intended time interval of the participation when used in future contexts, such as EHR Instructions.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE_TIME"
                ]
            }
        },
        "description": "Model of a participation of a Party (any Actor or Role) in an activity.  Used to represent any participation of a Party in some activity, which is not  explicitly in the model, e.g. assisting nurse. Can be used to record past or  future participations.\n\n\nShould not be used in place of more permanent relationships between demographic entities.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_participation_class"
    },
    "PARTY": {
        "abstract": "true",
        "attributes": {
            "contacts": {
                "description": "Contacts for this party.",
                "existence": "0..1",
                "type": [
                    "List",
                    "CONTACT"
                ]
            },
            "details": {
                "description": "All other details for this Party.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "identities": {
                "description": "Identities used by the party to identify itself, such as legal name, stage names, aliases, nicknames and so on.",
                "existence": "1..1",
                "type": [
                    "List",
                    "PARTY_IDENTITY"
                ]
            },
            "relationships": {
                "description": "Relationships in which this Party takes part as source.",
                "existence": "0..1",
                "type": [
                    "List",
                    "PARTY_RELATIONSHIP"
                ]
            },
            "reverse_relationships": {
                "description": "References to relationships in which this Party takes part as target.",
                "existence": "0..1",
                "type": [
                    "List",
                    "LOCATABLE_REF"
                ]
            }
        },
        "description": "Ancestor of all Party types, including real world entities and their roles. A Party is any entity which can participate in an activity. The name attribute inherited from LOCATABLE is used to indicate the actual type of party (note that the actual names, i.e. identities of parties are indicated in the identities attribute, not the name attribute).\n\n\n\n\n\nNote\n\n\nIt is strongly recommended that the inherited attribute uid be populated in PARTY objects, using the UID copied from the object_id() of the uid field of the enclosing VERSION object.\nFor example, the ORIGINAL_VERSION.uid 87284370-2D4B-4e3d-A3F3-F303D2F4F34B::uk.nhs.ehr1::2  would be copied to the uid field of the PARTY object.",
        "functions": {
            "type ()": {
                "description": "Type of party, such as  PERSON,  ORGANISATION, etc. Role name, e.g.  general practitioner ,  nurse ,  private citizen . Taken from inherited name attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_party_class"
    },
    "PARTY_IDENTIFIED": {
        "attributes": {
            "identifiers": {
                "description": "One or more formal identifiers (possibly computable).",
                "existence": "0..1",
                "type": [
                    "List",
                    "DV_IDENTIFIER"
                ]
            },
            "name": {
                "description": "Optional human-readable name (in String form).",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Proxy data for an identified party other than the subject of the record, minimally consisting of human-readable identifier(s), such as name, formal (and possibly computable) identifiers such as NHS number, and an optional link to external data. There must be at least one of name, identifier or external_ref present.\n\n\nUsed to describe parties where only identifiers may be known, and there is no entry at all in the demographic system (or even no demographic system). Typically for health care providers, e.g. name and provider number of an institution.\n\n\nShould not be used to include patient identifying information.",
        "inherit": "PARTY_PROXY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_party_identified_class"
    },
    "PARTY_IDENTITY": {
        "attributes": {
            "details": {
                "description": "The value of the identity. This will often taken the form of a parseable string or a small structure of strings.",
                "existence": "1..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            }
        },
        "description": "An identity  owned  by a Party, such as a person name or company name, and which is used by the Party to identify itself. Actual structure is archetyped.",
        "functions": {
            "purpose ()": {
                "description": "Purpose of identity, e.g. legal ,  stagename,  nickname,  tribal name,  trading name. Taken from value of inherited name attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_party_identity_class"
    },
    "PARTY_PROXY": {
        "abstract": "true",
        "attributes": {
            "external_ref": {
                "description": "Optional reference to more detailed demographic or identification information for this party, in an external system.",
                "existence": "0..1",
                "type": [
                    "PARTY_REF"
                ]
            }
        },
        "description": "Abstract concept of a proxy description of a party, including an optional link to data for this party in a demographic or other identity management system. Sub- typed into PARTY_IDENTIFIED and PARTY_SELF.",
        "specialization": [
            "PARTY_SELF",
            "PARTY_IDENTIFIED"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_party_proxy_class"
    },
    "PARTY_REF": {
        "description": "Identifier for parties in a demographic or identity service. There are typically a number of subtypes of the PARTY class, including PERSON, ORGANISATION, etc. Abstract supertypes are allowed if the referenced object is of a type not known by the current implementation of this class (in other words, if the demographic model is changed by the addition of a new PARTY or ACTOR subtypes, valid PARTY_REFs can still be constructed to them).",
        "inherit": "OBJECT_REF",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_party_ref_class"
    },
    "PARTY_RELATED": {
        "attributes": {
            "relationship": {
                "description": "Relationship of subject of this ENTRY to the subject of the record. May be coded. If it is the patient, coded as  self.",
                "existence": "1..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            }
        },
        "description": "Proxy type for identifying a party and its relationship to the subject of the record. Use where the relationship between the party and the subject of the record must be known.",
        "inherit": "PARTY_IDENTIFIED",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_party_related_class"
    },
    "PARTY_RELATIONSHIP": {
        "attributes": {
            "details": {
                "description": "The detailed description of the relationship.",
                "existence": "0..1",
                "type": [
                    "ITEM_STRUCTURE"
                ]
            },
            "source": {
                "description": "Source of relationship.",
                "existence": "1..1",
                "type": [
                    "PARTY_REF"
                ]
            },
            "target": {
                "description": "Target of relationship.",
                "existence": "1..1",
                "type": [
                    "PARTY_REF"
                ]
            },
            "time_validity": {
                "description": "Valid time interval for this relationship.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE"
                ]
            }
        },
        "description": "Generic description of a relationship between parties.",
        "functions": {
            "type ()": {
                "description": "Type of relationship, such as  employment,  authority,  health provision",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_TEXT"
                ]
            }
        },
        "inherit": "LOCATABLE",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_party_relationship_class"
    },
    "PARTY_SELF": {
        "description": "Party proxy representing the subject of the record. Used to indicate that the party is the owner of the record. May or may not have external_ref set.",
        "inherit": "PARTY_PROXY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_party_self_class"
    },
    "PATHABLE": {
        "abstract": "true",
        "description": "The PATHABLE class defines the pathing capabilities used by nearly all classes in the openEHR reference model, mostly via inheritance of LOCATABLE. The defining characteristics of PATHABLE objects are that they can locate child objects using paths, and they know their parent object in a compositional hierarchy. The parent feature is defined as abstract in the model, and may be implemented in any way convenient.",
        "functions": {
            "item_at_path (a_path: String[1])": {
                "description": "The item at a path (relative to this item); only valid for unique paths, i.e. paths that resolve to a single item.",
                "existence": "1..1",
                "prerequisite": "path_unique (a_path)",
                "return_type": [
                    "Any"
                ]
            },
            "items_at_path (a_path: String[1])": {
                "description": "List of items corresponding to a non-unique path.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "Any"
                ]
            },
            "parent ()": {
                "description": "Parent of this node in a compositional hierarchy.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "PATHABLE"
                ]
            },
            "path_exists (a_path: String[1])": {
                "description": "True if the path exists in the data with respect to the current item.",
                "existence": "1..1",
                "prerequisite": "not a_path.is_empty",
                "return_type": [
                    "Boolean"
                ]
            },
            "path_of_item (a_loc: PATHABLE[1])": {
                "description": "The path to an item relative to the root of this archetyped structure.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "path_unique (a_path: String[1])": {
                "description": "True if the path corresponds to a single item in the data.",
                "existence": "1..1",
                "prerequisite": "path_exists (a_path)",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "Any",
        "specialization": [
            "LOCATABLE"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_pathable_class"
    },
    "PERSON": {
        "description": "Generic description of persons. Provides a dedicated type to which Person archetypes can be targeted.",
        "inherit": "ACTOR",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_person_class"
    },
    "POINT_EVENT<T>": {
        "description": "Defines a single point event in a series.",
        "inherit": "EVENT",
        "type": "Class"
    },
    "PROPORTION_KIND": {
        "description": "Class of enumeration constants defining types of proportion for the DV_PROPORTION class.",
        "functions": {
            "valid_proportion_kind (nq: Integer[1])": {
                "description": "True if n is one of the defined types.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_proportion_kind_class"
    },
    "Quantity_converter": {
        "description": "Quantity conversion.",
        "functions": {
            "convert_value (value: Real[1],from_units: String[1],to_units: String[1],property: Terminology_code[1])": {
                "description": "Convert value of physical property type (e.g. 'pressure' etc) from one units to another.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Real"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_quantity_converter_interface"
    },
    "REFERENCE_RANGE<T>": {
        "attributes": {
            "meaning": {
                "description": "Term whose value indicates the meaning of this range, e.g.  normal,  critical,  therapeutic  etc.",
                "existence": "1..1",
                "type": [
                    "DV_TEXT"
                ]
            },
            "range": {
                "description": "The data range for this meaning, e.g. critical  etc.",
                "existence": "1..1",
                "type": [
                    "DV_INTERVAL"
                ]
            }
        },
        "description": "Defines a named range to be associated with any DV_ORDERED datum. Each such range is particular to the patient and context, e.g. sex, age, and any other factor which affects ranges. May be used to represent normal, therapeutic, dangerous, critical etc ranges.",
        "functions": {
            "is_in_range (v: DV_ORDERED[1])": {
                "description": "Indicates if the value  v is inside the range.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class"
    },
    "RESOURCE_DESCRIPTION": {
        "attributes": {
            "details": {
                "description": "Details of all parts of resource description that are natural language-dependent, keyed by language code.",
                "existence": "1..1",
                "type": [
                    "Hash",
                    "String",
                    "RESOURCE_DESCRIPTION_ITEM"
                ]
            },
            "lifecycle_state": {
                "description": "Lifecycle state of the resource, typically including states such as: initial | submitted | experimental | awaiting_approval | approved | superseded | obsolete.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "original_author": {
                "description": "Original author of this resource, with all relevant details, including organisation.",
                "existence": "1..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "other_contributors": {
                "description": "Other contributors to the resource, probably listed in  'name <email>'  form.",
                "existence": "0..1",
                "type": [
                    "List",
                    "String"
                ]
            },
            "other_details": {
                "description": "Additional non language-senstive resource meta-data, as a list of name/value pairs.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "parent_resource": {
                "description": "Reference to owning resource.",
                "existence": "1..1",
                "type": [
                    "AUTHORED_RESOURCE"
                ]
            },
            "resource_package_uri": {
                "description": "URI of package to which this resource belongs.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Defines the descriptive meta-data of a resource.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/resource.html#_resource_description_class"
    },
    "RESOURCE_DESCRIPTION_ITEM": {
        "attributes": {
            "copyright": {
                "description": "Optional copyright statement for the resource as a knowledge resource.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "keywords": {
                "description": "Keywords which characterise this resource, used e.g. for indexing and searching.",
                "existence": "0..1",
                "type": [
                    "List",
                    "String"
                ]
            },
            "language": {
                "description": "The localised language in which the items in this description item are written. Coded from openEHR code set languages.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "misuse": {
                "description": "Description of any misuses of the resource, i.e. contexts in which it should not be used.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "original_resource_uri": {
                "description": "URIs of original clinical document(s) or description of which resource is a formalisation, in the language of this description item; keyed by meaning.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "other_details": {
                "description": "Additional language-senstive resource metadata, as a list of name/value pairs.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "purpose": {
                "description": "Purpose of the resource.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            },
            "use": {
                "description": "Description of the uses of the resource, i.e. contexts in which it could be used.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Language-specific detail of resource description. When a resource is translated for use in another language environment, each RESOURCE_DESCRIPTION_ITEM needs to be copied and translated into the new language.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/resource.html#_resource_description_item_class"
    },
    "REVISION_HISTORY": {
        "attributes": {
            "items": {
                "description": "The items in this history in most-recent-last order.",
                "existence": "1..1",
                "type": [
                    "List",
                    "REVISION_HISTORY_ITEM"
                ]
            }
        },
        "description": "Purpose Defines the notion of a revision history of audit items, each associated with the version for which that audit was committed. The list is in most-recent-first order.",
        "functions": {
            "most_recent_version ()": {
                "description": "The version id of the most recent item, as a String.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "most_recent_version_time_committed ()": {
                "description": "The commit date/time of the most recent item, as a String.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_revision_history_class"
    },
    "REVISION_HISTORY_ITEM": {
        "attributes": {
            "audits": {
                "description": "The audits for this revision; there will always be at least one commit audit (which may itself be an ATTESTATION), there may also be further attestations.",
                "existence": "1..1",
                "type": [
                    "List",
                    "AUDIT_DETAILS"
                ]
            },
            "version_id": {
                "description": "Version identifier for this revision.",
                "existence": "1..1",
                "type": [
                    "OBJECT_VERSION_ID"
                ]
            }
        },
        "description": "An entry in a revision history, corresponding to a version from a versioned container. Consists of AUDIT_DETAILS instances with revision identifier of the revision to which the AUDIT_DETAILS instance belongs.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_revision_history_item_class"
    },
    "ROLE": {
        "attributes": {
            "capabilities": {
                "description": "The capabilities of this role.",
                "existence": "0..1",
                "type": [
                    "List",
                    "CAPABILITY"
                ]
            },
            "performer": {
                "description": "Reference to Version container of Actor playing the role.",
                "existence": "1..1",
                "type": [
                    "PARTY_REF"
                ]
            },
            "time_validity": {
                "description": "Valid time interval for this role.",
                "existence": "0..1",
                "type": [
                    "DV_INTERVAL",
                    "DV_DATE"
                ]
            }
        },
        "description": "Generic description of a role performed by an Actor. The role corresponds to a competency of the Party. Roles are used to define the responsibilities undertaken by a Party for a purpose. Roles should have credentials qualifying the performer to perform the role.",
        "inherit": "PARTY",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_role_class"
    },
    "SECTION": {
        "attributes": {
            "items": {
                "description": "Ordered list of content items under this section, which may include:\n\n\n\n\nmore SECTIONs;\n\n\nENTRYs.",
                "existence": "0..1",
                "type": [
                    "List",
                    "CONTENT_ITEM"
                ]
            }
        },
        "description": "Represents a heading in a heading structure, or  section tree.  Created according to archetyped structures for typical headings such as SOAP,  physical examination, but also pathology result heading structures.  Should not be used instead of ENTRY hierarchical structures.",
        "inherit": "CONTENT_ITEM",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_section_class"
    },
    "SYNC_EXTRACT": {
        "attributes": {
            "items": {
                "description": "Content, in the form of a serialised Contributions.",
                "existence": "0..1",
                "type": [
                    "List",
                    "X_CONTRIBUTION"
                ]
            },
            "specification": {
                "description": "Details of specification of this Extract.",
                "existence": "1..1",
                "type": [
                    "SYNC_EXTRACT_SPEC"
                ]
            }
        },
        "description": "",
        "inherit": "MESSAGE_CONTENT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_sync_extract_class"
    },
    "SYNC_EXTRACT_REQUEST": {
        "attributes": {
            "specification": {
                "description": "Details of specification of synchronisation request.",
                "existence": "1..1",
                "type": [
                    "SYNC_EXTRACT_SPEC"
                ]
            }
        },
        "description": "Type of request designed for synchronisation of Contributions between openEHR servers.",
        "inherit": "MESSAGE_CONTENT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_sync_extract_request_class"
    },
    "SYNC_EXTRACT_SPEC": {
        "attributes": {
            "all_contributions": {
                "description": "True if all Contributions in the record are included.",
                "existence": "0..1",
                "type": [
                    "Boolean"
                ]
            },
            "contribution_list": {
                "description": "List of Contributions to include / that are included in the Extract.",
                "existence": "0..1",
                "type": [
                    "List",
                    "HIER_OBJECT_ID"
                ]
            },
            "contributions_since": {
                "description": "Specify Contributions included in Extract by threshold date.",
                "existence": "0..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "includes_versions": {
                "description": "True if the Versions from the Contribution are included; False if just the Contribution and its Audit are included.",
                "existence": "1..1",
                "type": [
                    "Boolean"
                ]
            }
        },
        "description": "Details of specification of Extract, used in a request to specify an Extract, or in a response, to describe what is actually in the Extract.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_sync_extract_spec_class"
    },
    "Statistical_evaluator": {
        "description": "A basic statistical evaluator class providing common functions on collections of numbers.",
        "functions": {
            "avg (vals: Container<Numeric>[1])": {
                "description": "Synonym for mean().",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "count (vals: Container<Numeric>[1])": {
                "description": "Return the number of items in vals, i.e. vals.count.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Numeric"
                ]
            },
            "max (vals: Container<Numeric>[1])": {
                "description": "Maximum of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Numeric"
                ]
            },
            "mean (vals: Container<Numeric>[1])": {
                "description": "Mean (arithmetic average) of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "median (vals: Container<Numeric>[1])": {
                "description": "Return numerically centre value in ordered form of container contents.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Numeric"
                ]
            },
            "min (vals: Container<Numeric>[1])": {
                "description": "Minimum of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Numeric"
                ]
            },
            "mode (vals: Container<Numeric>[1])": {
                "description": "Mode (most frequent) of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Numeric"
                ]
            },
            "std_dev (vals: Container<Numeric>[1])": {
                "description": "Compute standard deviation of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            },
            "sum (vals: Container<Numeric>[1])": {
                "description": "Sum of a container of values.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Double"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_statistical_evaluator_interface"
    },
    "TEMPLATE_ID": {
        "description": "Identifier for templates. Lexical form to be determined.",
        "inherit": "OBJECT_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_template_id_class"
    },
    "TERMINOLOGY_ACCESS": {
        "description": "Defines an object providing proxy access to a terminology.",
        "functions": {
            "all_codes ()": {
                "description": "Return all codes known in this terminology.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "CODE_PHRASE"
                ]
            },
            "codes_for_group_id (a_group_id: String[1])": {
                "description": "Return all codes under grouper 'a_group_id' from this terminology.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "CODE_PHRASE"
                ]
            },
            "codes_for_group_name (a_lang: String[1],a_name: String[1])": {
                "description": "Return all codes under grouper whose name in 'a_lang' is 'a_name' from this terminology.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "CODE_PHRASE"
                ]
            },
            "has_code_for_group_id ()": {
                "description": "True if  a_code' is known in group  group_id' in the openEHR terminology.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "id ()": {
                "description": "Identification of this Terminology.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "rubric_for_code (a_code: String[1])": {
                "description": "Return all rubric of code  code' in language  lang'.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "type": "Interface",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_terminology_access_interface"
    },
    "TERMINOLOGY_ID": {
        "description": "Identifier for terminologies such as accessed via a terminology query service. In this class, the value attribute identifies the Terminology in the terminology service, e.g.  SNOMED-CT . A terminology is assumed to be in a particular language, which must be explicitly specified.\n\n\nThe value if the id attribute is the precise terminology id identifier, including actual release (i.e. actual  version), local modifications etc; e.g. ICPC2.\n\n\nLexical form: name [  '(' version  ')' ].",
        "functions": {
            "name ()": {
                "description": "Return the terminology id (which includes the  version  in some cases). Distinct names correspond to distinct (i.e. non-compatible) terminologies. Thus the names  ICD10AM  and  ICD10  refer to distinct terminologies.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "version_id ()": {
                "description": "Version of this terminology, if versioning supported, else the empty string.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "inherit": "OBJECT_ID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_terminology_id_class"
    },
    "TERMINOLOGY_SERVICE": {
        "description": "Defines an object providing proxy access to a terminology service.",
        "functions": {
            "code_set (name: String[1])": {
                "description": "Return an interface to the code_set identified by the external identifier name (e.g.  ISO_639-1).",
                "existence": "1..1",
                "prerequisite": "has_code_set (name)",
                "return_type": [
                    "CODE_SET_ACCESS"
                ]
            },
            "code_set_for_id (id: String[1])": {
                "description": "Return an interface to the code_set identified internally in openEHR by id.",
                "existence": "1..1",
                "prerequisite": "valid_code_set_id (id)",
                "return_type": [
                    "CODE_SET_ACCESS"
                ]
            },
            "code_set_identifiers ()": {
                "description": "Set of all code sets identifiers for which there is an internal openEHR name; returned as a Map of ids keyed by internal name.",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "String"
                ]
            },
            "has_code_set (name: String[1])": {
                "description": "True if code_set linked to internal name (e.g. languages ) is available.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "has_terminology (name: String[1])": {
                "description": "True if terminology named name known by this service. Allowable names include:-\n\n\n\n\nopenehr\n\n\ncentc251\n\n\nany name from are taken from the US NLM UMLS meta-data list at       http://www.nlm.nih.gov/research/umls/metaa1.html",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "openehr_code_sets ()": {
                "description": "Set of all code set identifiers known in the terminology service.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "terminology (name: String[1])": {
                "description": "Return an interface to the terminology named name. Allowable names include:-\n\n\n\n\nopenehr,\n\n\ncentc251,\n\n\nany name from are taken from the US NLM UMLS meta-data list at http://www.nlm.nih.gov/research/umls/metaa1.html",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "TERMINOLOGY_ACCESS"
                ]
            },
            "terminology_identifiers ()": {
                "description": "Set of all terminology identifiers known in the terminology service. Values from the US NLM UMLS meta-data list at:- http://www.nlm.nih.gov/research/umls/metaa1.html",
                "existence": "0..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "String"
                ]
            }
        },
        "inherit": "OPENEHR_TERMINOLOGY_GROUP_IDENTIFIERS, OPENEHR_CODE_SET_IDENTIFIERS",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/support.html#_terminology_service_class"
    },
    "TERM_MAPPING": {
        "attributes": {
            "match": {
                "description": "The relative match of the target term with respect to the mapped text item. Result meanings:\n\n\n\n\n'>': the mapping is to a broader term e.g. orginal text =  arbovirus infection , target =  viral infection\n\n\n'=': the mapping is to a (supposedly) equivalent to the original item\n\n\n'<': the mapping is to a narrower term. e.g. original text =  diabetes , mapping =  diabetes mellitus .\n\n\n'?': the kind of mapping is unknown.\n\n\n\n\nThe first three values are taken from the ISO standards 2788 ( Guide to Establishment and development of monolingual thesauri) and 5964 (Guide to Establishment and development of multilingual thesauri).",
                "existence": "1..1",
                "type": [
                    "char"
                ]
            },
            "purpose": {
                "description": "Purpose of the mapping e.g. 'automated data mining', 'billing', 'interoperability'.",
                "existence": "0..1",
                "type": [
                    "DV_CODED_TEXT"
                ]
            },
            "target": {
                "description": "The target term of the mapping.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            }
        },
        "description": "Represents a coded term mapped to a DV_TEXT, and the relative match of the target term with respect to the mapped item. Plain or coded text items may appear in the EHR for which one or mappings in alternative terminologies are required. Mappings are only used to enable computer processing, so they can only be instances of DV_CODED_TEXT.\n\n\nUsed for adding classification terms (e.g. adding ICD classifiers to SNOMED descriptive terms), or mapping into equivalents in other terminologies (e.g. across nursing vocabularies).",
        "functions": {
            "broader ()": {
                "description": "The mapping is to a broader term.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "equivalent ()": {
                "description": "The mapping is to an equivalent term.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_valid_match_code (c: char[1])": {
                "description": "True if match valid.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "narrower ()": {
                "description": "The mapping is to a narrower term.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "unknown ()": {
                "description": "The kind of mapping is unknown.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/data_types.html#_term_mapping_class"
    },
    "TRANSLATION_DETAILS": {
        "attributes": {
            "accreditaton": {
                "description": "Accreditation of translator, usually a national translator\u2019s registration or association membership id.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            },
            "author": {
                "description": "Translator name and other demographic details.",
                "existence": "1..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            },
            "language": {
                "description": "Language of the translation.",
                "existence": "1..1",
                "type": [
                    "CODE_PHRASE"
                ]
            },
            "other_details": {
                "description": "Any other meta-data.",
                "existence": "0..1",
                "type": [
                    "Hash",
                    "String",
                    " String"
                ]
            }
        },
        "description": "Class providing details of a natural language translation.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/resource.html#_translation_details_class"
    },
    "UID": {
        "abstract": "true",
        "attributes": {
            "value": {
                "description": "The value of the id.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Abstract parent of classes representing unique identifiers which identify information entities in a durable way. UIDs only ever identify one IE in time or space and are never re-used.",
        "specialization": [
            "ISO_OID",
            "UUID",
            "INTERNET_ID"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_uid_class"
    },
    "UID_BASED_ID": {
        "abstract": "true",
        "description": "Abstract model of UID-based identifiers consisting of a root part and an optional extension; lexical form: root '::' extension.",
        "functions": {
            "extension ()": {
                "description": "Optional local identifier of the object within the context of the root identifier. Returns the part to the right of the first '::' separator if any, or else any empty String.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "has_extension ()": {
                "description": "True if not extension.is_empty().",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "root ()": {
                "description": "The identifier of the conceptual namespace in which the object exists, within the identification scheme. Returns the part to the left of the first '::' separator, if any, or else the whole string.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "UID"
                ]
            }
        },
        "inherit": "OBJECT_ID",
        "specialization": [
            "HIER_OBJECT_ID",
            "OBJECT_VERSION_ID"
        ],
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_uid_based_id_class"
    },
    "UUID": {
        "description": "Model of the DCE Universal Unique Identifier or UUID which takes the form of hexadecimal integers separated by hyphens, following the pattern 8-4-4-4-12 as defined by the Open Group, CDE 1.1 Remote Procedure Call specification, Appendix A. Also known as a GUID.",
        "inherit": "UID",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_uuid_class"
    },
    "VALIDITY_KIND": {
        "attributes": {},
        "description": "An enumeration of three values that may commonly occur in constraint models.\n\n\nUse as the type of any attribute within this model, which expresses constraint on some attribute in a class in a reference model. For example to indicate validity\nof Date/Time fields.",
        "type": "Enumeration",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_validity_kind_enumeration"
    },
    "VERSION<T>": {
        "abstract": "true",
        "attributes": {
            "commit_audit": {
                "description": "Audit trail corresponding to the committal of this version to the VERSIONED_OBJECT.",
                "existence": "1..1",
                "type": [
                    "AUDIT_DETAILS"
                ]
            },
            "contribution": {
                "description": "Contribution in which this version was added.",
                "existence": "1..1",
                "type": [
                    "OBJECT_REF"
                ]
            },
            "signature": {
                "description": "OpenPGP digital signature or digest of content committed in this Version.",
                "existence": "0..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Abstract model of one Version within a Version container, containing data, commit audit trail, and the identifier of its Contribution.",
        "functions": {
            "canonical_form ()": {
                "description": "A canonical serial form of this Version, suitable for generating reliable hashes and signatures.\nCanonical form of Version object, created by serialising all attributes except\nsignature.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "data ()": {
                "description": "The data of this Version.\nOriginal content of this Version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "T"
                ]
            },
            "is_branch ()": {
                "description": "True if this Version represents a branch. Derived from uid attribute.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "lifecycle_state ()": {
                "description": "Lifecycle state of this version; coded by openEHR vocabulary version lifecycle state.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_CODED_TEXT"
                ]
            },
            "owner_id ()": {
                "description": "Copy of the owning VERSIONED_OBJECT.uid value; extracted from the local uid property\u2019s object_id.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "preceding_version_uid ()": {
                "description": "Unique identifier of the version of which this version is a modification; Void if this is the first version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "OBJECT_VERSION_ID"
                ]
            },
            "uid ()": {
                "description": "Unique identifier of this VERSION, in the form of an {object_id, a version_tree_id, creating_system_id} triple, where the object_id has the same value as the containing VERSIONED_OBJECT uid.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "OBJECT_VERSION_ID"
                ]
            }
        },
        "type": "Class"
    },
    "VERSIONED_COMPOSITION": {
        "description": "Version-controlled composition abstraction, defined by inheriting VERSIONED_OBJECT<COMPOSITION>.",
        "functions": {
            "is_persistent ()": {
                "description": "Indicates whether this composition set is persistent; derived from first version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            }
        },
        "inherit": "VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_versioned_composition_class"
    },
    "VERSIONED_EHR_ACCESS": {
        "description": "Version container for EHR_ACCESS instance.",
        "inherit": "VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_versioned_ehr_access_class"
    },
    "VERSIONED_EHR_STATUS": {
        "description": "Version container for EHR_STATUS instance.",
        "inherit": "VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr.html#_versioned_ehr_status_class"
    },
    "VERSIONED_FOLDER": {
        "description": "A version-controlled hierarchy of FOLDERs giving the effect of a directory.",
        "inherit": "VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/common.html#_versioned_folder_class"
    },
    "VERSIONED_OBJECT<T>": {
        "attributes": {
            "owner_id": {
                "description": "Reference to object to which this version container belongs, e.g. the id of the containing EHR or other relevant owning entity.",
                "existence": "1..1",
                "type": [
                    "OBJECT_REF"
                ]
            },
            "time_created": {
                "description": "Time of initial creation of this versioned object.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "uid": {
                "description": "Unique identifier of this version container in the form of a UID with no extension. This id will be the same in all instances of the same container in a distributed environment, meaning that it can be understood as the uid of the  virtual version tree.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            }
        },
        "description": "Version control abstraction, defining semantics for versioning one complex object.",
        "functions": {
            "all_version_ids ()": {
                "description": "Return a list of ids of all versions in this object.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "OBJECT_VERSION_ID"
                ]
            },
            "all_versions ()": {
                "description": "Return a list of all versions in this object.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "List",
                    "VERSION"
                ]
            },
            "commit_attestation (an_attestation: ATTESTATION[1],a_ver_id: OBJECT_VERSION_ID[1],signing_key: String[1])": {
                "description": "Add a new attestation to a specified original version. Attestations can only be added to Original versions.",
                "existence": "1..1",
                "prerequisite": "has_version_id(a_ver_id)",
                "return_type": [
                    "void"
                ]
            },
            "commit_imported_version (a_contribution: OBJECT_REF[1],an_audit: AUDIT_DETAILS[1],a_version: ORIGINAL_VERSION[1])": {
                "description": "Add a new imported version. Details of version id etc come from the ORIGINAL_VERSION being committed.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "void"
                ]
            },
            "commit_original_merged_version (a_contribution: OBJECT_REF[1],a_new_version_uid: OBJECT_VERSION_ID[1],a_preceding_version_id: OBJECT_VERSION_ID[1],an_audit: AUDIT_DETAILS[1],a_lifecycle_state: DV_CODED_TEXT[1],a_data: T[1],an_other_input_uids: List<OBJECT_VERSION_ID>[1],signing_key: String[1])": {
                "description": "Add a new original merged version. This commit function adds a parameter containing the ids of other versions merged into the current one.",
                "existence": "1..1",
                "prerequisite": "all_version_ids.has (a_preceding_version_uid) or else version_count = 0",
                "return_type": [
                    "void"
                ]
            },
            "commit_original_version (a_contribution: OBJECT_REF[1],a_new_version_uid: OBJECT_VERSION_ID[1],a_preceding_version_id: OBJECT_VERSION_ID[1],an_audit: AUDIT_DETAILS[1],a_lifecycle_state: DV_CODED_TEXT[1],a_data: T[1],signing_key: String[1])": {
                "description": "Add a new original version.",
                "existence": "1..1",
                "prerequisite": "all_version_ids.has (a_preceding_version_uid) or else version_count = 0",
                "return_type": [
                    "void"
                ]
            },
            "has_version_at_time (a_time: DV_DATE_TIME[1])": {
                "description": "True if a version for time  a_time exists.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "has_version_id (a_version_uid: OBJECT_VERSION_ID[1])": {
                "description": "True if a version with a_version_uid exists.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "is_original_version (a_version_uid: OBJECT_VERSION_ID[1])": {
                "description": "True if version with a_version_uid is an ORIGINAL_VERSION.",
                "existence": "1..1",
                "prerequisite": "has_version_id(a_ver_id)",
                "return_type": [
                    "Boolean"
                ]
            },
            "latest_trunk_version ()": {
                "description": "Return the most recently added trunk version.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "VERSION"
                ]
            },
            "latest_version ()": {
                "description": "Return the most recently added version (i.e. on trunk or any branch).",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "VERSION"
                ]
            },
            "revision_history ()": {
                "description": "History of all audits and attestations in this versioned repository.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "REVISION_HISTORY"
                ]
            },
            "trunk_lifecycle_state ()": {
                "description": "Return the lifecycle state from the latest trunk version. Useful for determining if the version container is logically deleted.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "DV_CODED_TEXT"
                ]
            },
            "version_at_time (a_time: DV_DATE_TIME[1])": {
                "description": "Return the version for time  a_time.",
                "existence": "1..1",
                "prerequisite": "has_version_at_time (a_time)",
                "return_type": [
                    "VERSION"
                ]
            },
            "version_count ()": {
                "description": "Return the total number of versions in this object.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Integer"
                ]
            },
            "version_with_id (a_version_uid: OBJECT_VERSION_ID[1])": {
                "description": "Return the version with uid =  a_version_uid.",
                "existence": "1..1",
                "prerequisite": "has_version_id (a_ver_id)",
                "return_type": [
                    "VERSION"
                ]
            }
        },
        "type": "Class"
    },
    "VERSIONED_PARTY": {
        "description": "Static type formed by binding generic parameter of VERSIONED_OBJECT<T> to PARTY.",
        "inherit": "VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/demographic.html#_versioned_party_class"
    },
    "VERSION_STATUS": {
        "attributes": {},
        "description": "Status of a versioned artefact, as one of a number of possible values: uncontrolled, prerelease, release, build.",
        "type": "Enumeration",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_version_status_enumeration"
    },
    "VERSION_TREE_ID": {
        "attributes": {
            "value": {
                "description": "String form of this identifier.",
                "existence": "1..1",
                "type": [
                    "String"
                ]
            }
        },
        "description": "Version tree identifier for one version. Lexical form:\n\n\ntrunk_version [  '.' branch_number  '.' branch_version ]",
        "functions": {
            "branch_number ()": {
                "description": "Number of branch from the trunk point; numbering starts at 1.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "branch_version ()": {
                "description": "Version of the branch; numbering starts at 1.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            },
            "is_branch ()": {
                "description": "True if this version identifier represents a branch, i.e. has branch_number and branch_version parts.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "Boolean"
                ]
            },
            "trunk_version ()": {
                "description": "Trunk version number; numbering starts at 1.",
                "existence": "1..1",
                "prerequisite": "",
                "return_type": [
                    "String"
                ]
            }
        },
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/BASE/development/base_types.html#_version_tree_id_class"
    },
    "X_CONTRIBUTION": {
        "attributes": {
            "audit": {
                "description": "Audit of Contribution in source system.",
                "existence": "1..1",
                "type": [
                    "AUDIT_DETAILS"
                ]
            },
            "uid": {
                "description": "Uid of Contribution in source system.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "versions": {
                "description": "Serialised Versions from Contribution in source system.",
                "existence": "0..1",
                "type": [
                    "List",
                    "VERSION"
                ]
            }
        },
        "description": "Serialised form of Contribution for an Extract.",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_contribution_class"
    },
    "X_VERSIONED_COMPOSITION": {
        "description": "Form of X_VERSIONED_OBJECT for COMPOSITION EHR object.",
        "inherit": "X_VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_versioned_composition_class"
    },
    "X_VERSIONED_EHR_ACCESS": {
        "description": "Form of X_VERSIONED_OBJECT for EHR_ACCESS EHR object.",
        "inherit": "X_VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_versioned_ehr_access_class"
    },
    "X_VERSIONED_EHR_STATUS": {
        "description": "Form of X_VERSIONED_OBJECT for EHR_STATUS EHR object.",
        "inherit": "X_VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_versioned_ehr_status_class"
    },
    "X_VERSIONED_FOLDER": {
        "description": "Form of X_VERSIONED_OBJECT for FOLDER EHR object.",
        "inherit": "X_VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_versioned_folder_class"
    },
    "X_VERSIONED_OBJECT<T>": {
        "attributes": {
            "extract_version_count": {
                "description": "The number of Versions in this extract for this Versioned object, i.e. the count of items in the versions attribute. May be 0 if only revision history is requested.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "owner_id": {
                "description": "Owner_id from original VERSIONED_OBJECT, which identifies source EHR.",
                "existence": "1..1",
                "type": [
                    "OBJECT_REF"
                ]
            },
            "revision_history": {
                "description": "Optional revision history of the original VERSIONED_OBJECT. If included, it is the complete revision history.",
                "existence": "0..1",
                "type": [
                    "REVISION_HISTORY"
                ]
            },
            "time_created": {
                "description": "Creation time of original VERSIONED_OBJECT.",
                "existence": "1..1",
                "type": [
                    "DV_DATE_TIME"
                ]
            },
            "total_version_count": {
                "description": "Total number of versions in original VERSIONED_OBJECT at time of creation of this X_VERSIONED_OBJECT.",
                "existence": "1..1",
                "type": [
                    "Integer"
                ]
            },
            "uid": {
                "description": "Uid of original VERSIONED_OBJECT.",
                "existence": "1..1",
                "type": [
                    "HIER_OBJECT_ID"
                ]
            },
            "versions": {
                "description": "0 or more Versions from the original VERSIONED_OBJECT, according to the Extract specification.",
                "existence": "0..1",
                "type": [
                    "List",
                    "ORIGINAL_VERSION"
                ]
            }
        },
        "description": "Variety of Extract content that consists is a sharable data-oriented version of VERSIONED_OBJECT<T>.",
        "type": "Class"
    },
    "X_VERSIONED_PARTY": {
        "description": "Form of X_VERSIONED_OBJECT for PARTY demographic object.",
        "inherit": "X_VERSIONED_OBJECT",
        "type": "Class",
        "url": "https://specifications.openehr.org/releases/RM/development/ehr_extract.html#_x_versioned_party_class"
    }
};

